# Live Analytics Dashboard Integration

This document describes the live analytics dashboard integration for AI Studio V2.

## Overview

The analytics system provides real-time monitoring of API usage metrics including:
- Total API calls and success rates
- Response times and performance metrics
- Token usage and cost estimation
- Model distribution and usage patterns
- Real-time WebSocket streaming to the frontend dashboard

## Components

### 1. Database Layer
- **File**: `utils/snowflake_setup.py`
- **Table**: `api_usage_metrics`
- **Purpose**: Stores all API usage data with optimized indexes for fast queries

### 2. API Usage Tracking
- **File**: `services/api_usage_tracker.py`
- **Purpose**: Middleware that automatically captures API usage metrics
- **Features**: 
  - Tracks all API endpoints
  - Measures response times
  - Estimates costs based on model usage
  - Captures session and user information

### 3. Analytics Service
- **File**: `services/analytics_service.py`
- **Purpose**: Queries and aggregates analytics data from Snowflake
- **Features**:
  - Dashboard metrics calculation
  - Time-series data generation
  - Model usage distribution
  - Custom date range queries

### 4. WebSocket Streaming
- **File**: `services/analytics_websocket.py`
- **Purpose**: Real-time data streaming to frontend
- **Features**:
  - Automatic connection management
  - Periodic data broadcasts
  - Client message handling

### 5. API Endpoints
- **File**: `api/analytics.py`
- **Endpoints**:
  - `GET /api/analytics/metrics` - Dashboard metrics
  - `GET /api/analytics/usage` - Usage time series
  - `GET /api/analytics/models` - Model distribution
  - `GET /api/analytics/endpoints` - Endpoint statistics
  - `GET /api/analytics/realtime` - Real-time snapshot
  - `WS /ws/analytics` - WebSocket streaming
  - `GET /api/analytics/health` - Health check

## Setup Instructions

### 1. Environment Variables
Ensure your `.env` file contains Snowflake configuration:
```
SNOWFLAKE_USER=your_user
SNOWFLAKE_PASSWORD=your_password
SNOWFLAKE_ACCOUNT=your_account
SNOWFLAKE_WAREHOUSE=your_warehouse
SNOWFLAKE_DATABASE=your_database
SNOWFLAKE_SCHEMA=your_schema
SNOWFLAKE_ROLE=your_role  # Optional
```

### 2. Database Setup
Run the table creation script:
```bash
cd Backend
python utils/snowflake_setup.py api_usage
```

### 3. Test Setup
Verify everything is working:
```bash
cd Backend
python test_analytics_setup.py
```

### 4. Start the Server
The analytics components are automatically initialized when you start the main application:
```bash
cd Backend
python main.py
```

## Frontend Integration

The frontend analytics dashboard (`Frontend/src/pages/AnalyticsDashboard.jsx`) automatically connects to:
- WebSocket endpoint: `ws://localhost:port/ws/analytics`
- REST API endpoints: `/api/analytics/*`

## Data Flow

1. **API Request** → Middleware captures metrics
2. **Middleware** → Logs data to Snowflake asynchronously
3. **Analytics Service** → Queries and aggregates data
4. **WebSocket Manager** → Streams real-time updates
5. **Frontend Dashboard** → Displays live metrics

## Monitoring

### Health Checks
- `GET /api/analytics/health` - Service health status
- `GET /api/analytics/connections` - WebSocket connection count

### Logs
Analytics components log to the main application logger with prefix:
- `api_usage_tracker` - Middleware logging
- `analytics_service` - Service operations
- `analytics_api` - API endpoint operations
- `analytics_websocket` - WebSocket operations

## Performance Considerations

- Database operations are asynchronous to avoid blocking API requests
- WebSocket broadcasting is optimized for multiple clients
- Indexes are created on frequently queried columns
- Connection pooling is used for database efficiency

## Troubleshooting

### Common Issues

1. **Snowflake Connection Failed**
   - Check environment variables
   - Verify network connectivity
   - Confirm account/user permissions

2. **WebSocket Connection Issues**
   - Check CORS configuration
   - Verify WebSocket URL in frontend
   - Check firewall settings

3. **No Data in Dashboard**
   - Ensure API usage tracking middleware is active
   - Check if table exists and has data
   - Verify analytics service queries

### Debug Commands

```bash
# Test Snowflake connection
python -c "from utils.snowflake_setup import get_snowflake_config; import snowflake.connector; snowflake.connector.connect(**get_snowflake_config())"

# Check table structure
python -c "from services.analytics_service import AnalyticsService; print(AnalyticsService().get_dashboard_metrics())"

# Test WebSocket manager
python -c "from services.analytics_websocket import analytics_ws_manager; print(analytics_ws_manager.get_connection_count())"
```

## Security Notes

- API usage data may contain sensitive information
- Ensure Snowflake credentials are properly secured
- Consider data retention policies for usage metrics
- WebSocket connections should be secured in production
