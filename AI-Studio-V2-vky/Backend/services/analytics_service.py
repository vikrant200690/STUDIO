import json
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
import snowflake.connector
from utils.snowflake_setup import get_snowflake_config
from utils.logger import get_logger
 
logger = get_logger("analytics_service")
 
 
class AnalyticsService:
    """Service for querying and aggregating API usage analytics"""
 
    def __init__(self):
        self.snowflake_config = get_snowflake_config()
 
    def get_connection(self):
        """Get a Snowflake connection with timeout"""
        try:
            config = self.snowflake_config.copy()
            config['connect_timeout'] = 10
            config['network_timeout'] = 10
            return snowflake.connector.connect(**config)
        except Exception as e:
            logger.error(f"Failed to connect to Snowflake: {e}")
            raise
 
    def get_dashboard_metrics(self, user_id: str) -> Dict[str, Any]:
        """Get overall dashboard metrics for a specific user"""
        conn = None
        try:
            conn = self.get_connection()
            cursor = conn.cursor()
 
            # Get current period metrics (last 30 days)
            cursor.execute("""
                SELECT
                    COUNT(*) as total_calls,
                    AVG(response_time_ms) as avg_response_time,
                    SUM(estimated_cost) as total_cost,
                    SUM(tokens_total) as tokens_used,
                    CASE
                        WHEN COUNT(*) = 0 THEN 0
                        ELSE COUNT(CASE WHEN status_code < 400 THEN 1 END) * 100.0 / COUNT(*)
                    END as success_rate,
                    COUNT(DISTINCT session_id) as active_sessions
                FROM api_usage_metrics
                WHERE request_timestamp >= DATEADD(day, -30, CURRENT_TIMESTAMP())
                AND user_id = %s
            """, (user_id,))
 
            current = cursor.fetchone()
 
            # Get previous period metrics (30-60 days ago)
            cursor.execute("""
                SELECT
                    COUNT(*) as total_calls,
                    AVG(response_time_ms) as avg_response_time,
                    SUM(estimated_cost) as total_cost,
                    SUM(tokens_total) as tokens_used,
                    CASE
                        WHEN COUNT(*) = 0 THEN 0
                        ELSE COUNT(CASE WHEN status_code < 400 THEN 1 END) * 100.0 / COUNT(*)
                    END as success_rate,
                    COUNT(DISTINCT session_id) as active_sessions
                FROM api_usage_metrics
                WHERE request_timestamp >= DATEADD(day, -60, CURRENT_TIMESTAMP())
                AND request_timestamp < DATEADD(day, -30, CURRENT_TIMESTAMP())
                AND user_id = %s
            """, (user_id,))
 
            previous = cursor.fetchone()
 
            if current:
                result = {
                    # Current period
                    'totalCalls': int(current[0]) if current[0] else 0,
                    'avgResponseTime': round(float(current[1]) / 1000, 2) if current[1] else 0,
                    'totalCost': round(float(current[2]), 4) if current[2] else 0,
                    'tokensUsed': int(current[3]) if current[3] else 0,
                    'successRate': round(float(current[4]), 1) if current[4] else 0,
                    'activeProjects': int(current[5]) if current[5] else 0,
                    
                    # Previous period for comparison
                    'totalCallsPrev': int(previous[0]) if previous and previous[0] else 0,
                    'avgResponseTimePrev': round(float(previous[1]) / 1000, 2) if previous and previous[1] else 0,
                    'totalCostPrev': round(float(previous[2]), 4) if previous and previous[2] else 0,
                    'tokensUsedPrev': int(previous[3]) if previous and previous[3] else 0,
                    'successRatePrev': round(float(previous[4]), 1) if previous and previous[4] else 0,
                    'activeProjectsPrev': int(previous[5]) if previous and previous[5] else 0,
                }
                return result
 
            return {
                'totalCalls': 0, 'avgResponseTime': 0, 'totalCost': 0,
                'tokensUsed': 0, 'successRate': 0, 'activeProjects': 0,
                'totalCallsPrev': 0, 'avgResponseTimePrev': 0, 'totalCostPrev': 0,
                'tokensUsedPrev': 0, 'successRatePrev': 0, 'activeProjectsPrev': 0
            }
 
        except Exception as e:
            logger.error(f"Error getting dashboard metrics: {e}")
            return {
                'totalCalls': 0, 'avgResponseTime': 0, 'totalCost': 0,
                'tokensUsed': 0, 'successRate': 0, 'activeProjects': 0,
                'totalCallsPrev': 0, 'avgResponseTimePrev': 0, 'totalCostPrev': 0,
                'tokensUsedPrev': 0, 'successRatePrev': 0, 'activeProjectsPrev': 0
            }
        finally:
            if conn:
                conn.close()
 
    def get_usage_series(self, time_range: str = '30D', user_id: str = None) -> Dict[str, List[Dict[str, Any]]]:
        """Get usage time series data for different time ranges for a specific user"""
        conn = None
        try:
            conn = self.get_connection()
            cursor = conn.cursor()
 
            time_ranges = {
                '7D': 7,
                '30D': 30,
                '90D': 90,
                '1Y': 365
            }
 
            result = {}
 
            for range_key, days in time_ranges.items():
                cursor.execute("""
                    SELECT
                        DATE(request_timestamp) as date,
                        COUNT(*) as calls,
                        SUM(estimated_cost) as cost,
                        SUM(tokens_total) as tokens,
                        AVG(response_time_ms) as avg_response_time
                    FROM api_usage_metrics
                    WHERE request_timestamp >= DATEADD(day, -%s, CURRENT_TIMESTAMP())
                    AND user_id = %s
                    GROUP BY DATE(request_timestamp)
                    ORDER BY date
                """, (days, user_id))
 
                rows = cursor.fetchall()
 
                series_data = []
                for row in rows:
                    series_data.append({
                        'date': row[0].strftime('%Y-%m-%d') if row[0] else '',
                        'calls': int(row[1]) if row[1] else 0,
                        'cost': round(float(row[2]), 4) if row[2] else 0,
                        'tokens': int(row[3]) if row[3] else 0,
                        'avgResponseTime': round(float(row[4]) / 1000, 2) if row[4] else 0
                    })
 
                result[range_key] = series_data
 
            return result
 
        except Exception as e:
            logger.error(f"Error getting usage series: {e}")
            return {'7D': [], '30D': [], '90D': [], '1Y': []}
        finally:
            if conn:
                conn.close()
 
    def get_model_distribution(self, user_id: str) -> List[Dict[str, Any]]:
        """Get model usage distribution for a specific user"""
        conn = None
        try:
            conn = self.get_connection()
            cursor = conn.cursor()
 
            cursor.execute("""
                SELECT
                    COALESCE(model_used, 'Unknown') as model,
                    COUNT(*) as usage_count,
                    SUM(estimated_cost) as total_cost,
                    SUM(tokens_total) as total_tokens
                FROM api_usage_metrics
                WHERE request_timestamp >= DATEADD(day, -30, CURRENT_TIMESTAMP())
                AND user_id = %s
                GROUP BY model_used
                ORDER BY usage_count DESC
            """, (user_id,))
 
            rows = cursor.fetchall()
 
            distribution = []
            for row in rows:
                distribution.append({
                    'name': row[0] if row[0] else 'Unknown',
                    'value': int(row[1]) if row[1] else 0,
                    'cost': round(float(row[2]), 4) if row[2] else 0,
                    'tokens': int(row[3]) if row[3] else 0
                })
 
            return distribution
 
        except Exception as e:
            logger.error(f"Error getting model distribution: {e}")
            return []
        finally:
            if conn:
                conn.close()
 
    def get_custom_usage_data(self, days: int, user_id: str) -> List[Dict[str, Any]]:
        """Get usage data for custom number of days for a specific user"""
        conn = None
        try:
            conn = self.get_connection()
            cursor = conn.cursor()
 
            cursor.execute("""
                SELECT
                    DATE(request_timestamp) as date,
                    COUNT(*) as calls,
                    SUM(estimated_cost) as cost,
                    SUM(tokens_total) as tokens,
                    AVG(response_time_ms) as avg_response_time
                FROM api_usage_metrics
                WHERE request_timestamp >= DATEADD(day, -%s, CURRENT_TIMESTAMP())
                AND user_id = %s
                GROUP BY DATE(request_timestamp)
                ORDER BY date
            """, (days, user_id))
 
            rows = cursor.fetchall()
 
            series_data = []
            for row in rows:
                series_data.append({
                    'date': row[0].strftime('%Y-%m-%d') if row[0] else '',
                    'calls': int(row[1]) if row[1] else 0,
                    'cost': round(float(row[2]), 4) if row[2] else 0,
                    'tokens': int(row[3]) if row[3] else 0,
                    'avgResponseTime': round(float(row[4]) / 1000, 2) if row[4] else 0
                })
 
            return series_data
 
        except Exception as e:
            logger.error(f"Error getting custom usage data: {e}")
            return []
        finally:
            if conn:
                conn.close()
 
    def get_endpoint_stats(self, user_id: str) -> List[Dict[str, Any]]:
        """Get statistics by endpoint for a specific user"""
        conn = None
        try:
            conn = self.get_connection()
            cursor = conn.cursor()
 
            cursor.execute("""
                SELECT
                    COALESCE(endpoint, 'Unknown') as endpoint,
                    COUNT(*) as total_calls,
                    AVG(response_time_ms) as avg_response_time,
                    SUM(estimated_cost) as total_cost,
                    CASE
                        WHEN COUNT(*) = 0 THEN 0
                        ELSE COUNT(CASE WHEN status_code < 400 THEN 1 END) * 100.0 / COUNT(*)
                    END as success_rate
                FROM api_usage_metrics
                WHERE request_timestamp >= DATEADD(day, -30, CURRENT_TIMESTAMP())
                AND user_id = %s
                GROUP BY endpoint
                ORDER BY total_calls DESC
            """, (user_id,))
 
            rows = cursor.fetchall()
 
            stats = []
            for row in rows:
                stats.append({
                    'endpoint': row[0],
                    'totalCalls': int(row[1]) if row[1] else 0,
                    'avgResponseTime': round(float(row[2]) / 1000, 2) if row[2] else 0,
                    'totalCost': round(float(row[3]), 4) if row[3] else 0,
                    'successRate': round(float(row[4]), 1) if row[4] else 0
                })
 
            return stats
 
        except Exception as e:
            logger.error(f"Error getting endpoint stats: {e}")
            return []
        finally:
            if conn:
                conn.close()
 
    def get_real_time_metrics(self, user_id: str = None) -> Dict[str, Any]:
        """Get real-time metrics for WebSocket streaming for a specific user"""
        try:
            logger.info(f"Getting real-time metrics for user: {user_id}")
 
            # Get dashboard metrics
            logger.info("Fetching dashboard metrics...")
            metrics = self.get_dashboard_metrics(user_id=user_id)
            logger.info(f"Dashboard metrics: {metrics}")
 
            # Get model distribution
            logger.info("Fetching model distribution...")
            model_distribution = self.get_model_distribution(user_id=user_id)
            logger.info(f"Model distribution: {model_distribution}")
 
            # Get usage series for all time ranges
            logger.info("Fetching usage series...")
            usage_series = self.get_usage_series(user_id=user_id)
            logger.info(f"Usage series: {usage_series}")
 
            result = {
                'metrics': metrics,
                'modelDistribution': model_distribution,
                'usageSeries': usage_series,
                'timestamp': datetime.now().isoformat()
            }
 
            logger.info(f"Real-time metrics result: {result}")
            return result
 
        except Exception as e:
            logger.error(f"Error getting real-time metrics: {e}", exc_info=True)
            return {
                'metrics': {
                    'totalCalls': 0, 'avgResponseTime': 0, 'totalCost': 0,
                    'tokensUsed': 0, 'successRate': 0, 'activeProjects': 0,
                    'totalCallsPrev': 0, 'avgResponseTimePrev': 0, 'totalCostPrev': 0,
                    'tokensUsedPrev': 0, 'successRatePrev': 0, 'activeProjectsPrev': 0
                },
                'modelDistribution': [],
                'usageSeries': {'7D': [], '30D': [], '90D': [], '1Y': []},
                'timestamp': datetime.now().isoformat()
            }