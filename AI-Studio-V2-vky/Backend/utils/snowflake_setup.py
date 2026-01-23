import os
import snowflake.connector
from dotenv import load_dotenv

load_dotenv()


def get_snowflake_config():
    """Get Snowflake configuration with optional role and SSL settings"""
    config = {
        'user': os.getenv('SNOWFLAKE_USER'),
        'password': os.getenv('SNOWFLAKE_PASSWORD'),
        'account': os.getenv('SNOWFLAKE_ACCOUNT'),
        'warehouse': os.getenv('SNOWFLAKE_WAREHOUSE'),
        'database': os.getenv('SNOWFLAKE_DATABASE'),
        'schema': os.getenv('SNOWFLAKE_SCHEMA'),
        'insecure_mode': True,  # Disable SSL verification for testing
    }
    # Add role only if it's configured
    role = os.getenv('SNOWFLAKE_ROLE')
    if role and role != 'your_role':
        config['role'] = role
    return config


def create_tables():
    """Create Snowflake tables for document storage and API usage tracking"""
    try:
        config = get_snowflake_config()
        # print("[DEBUG] Snowflake config:", config)
        conn = snowflake.connector.connect(**config)
        cursor = conn.cursor()

        print("Creating documents table...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS documents (
                doc_id VARCHAR(255) PRIMARY KEY,
                filename VARCHAR(255),
                s3_key VARCHAR(500),
                file_size INTEGER,
                file_type VARCHAR(50),
                text_content TEXT,
                upload_timestamp TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP(),
                status VARCHAR(50) DEFAULT 'uploaded'
            )
        """)

        print("Dropping existing document_chunks table if exists...")
        cursor.execute("DROP TABLE IF EXISTS document_chunks")

        print("Creating document_chunks table...")
        cursor.execute("""
            CREATE TABLE document_chunks (
                chunk_id VARCHAR(255) PRIMARY KEY,
                doc_id VARCHAR(255),
                chunk_text TEXT,
                chunk_index INTEGER,
                embedding_vector TEXT,  -- Store as TEXT instead of VARIANT for better compatibility
                metadata TEXT,  -- Store enhanced metadata as JSON
                created_timestamp TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP(),
                FOREIGN KEY (doc_id) REFERENCES documents(doc_id)
            )
        """)

        print("Creating API usage tracking table...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS api_usage_metrics (
                usage_id VARCHAR(255) PRIMARY KEY,
                endpoint VARCHAR(255) NOT NULL,
                method VARCHAR(10) NOT NULL,
                status_code INTEGER NOT NULL,
                response_time_ms FLOAT NOT NULL,
                request_timestamp TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP(),
                session_id VARCHAR(255),
                user_ip VARCHAR(45),
                user_agent TEXT,
                model_used VARCHAR(100),
                tokens_input INTEGER DEFAULT 0,
                tokens_output INTEGER DEFAULT 0,
                tokens_total INTEGER DEFAULT 0,
                estimated_cost FLOAT DEFAULT 0.0,
                request_size_bytes INTEGER DEFAULT 0,
                response_size_bytes INTEGER DEFAULT 0,
                error_message TEXT,
                additional_metadata TEXT  -- JSON string for flexible metadata
            )
        """)

        # print("Creating indexes for API usage metrics...")
        # cursor.execute("""
        #     CREATE INDEX IF NOT EXISTS idx_api_usage_timestamp
        #     ON api_usage_metrics (request_timestamp)
        # """)

        # cursor.execute("""
        #     CREATE INDEX IF NOT EXISTS idx_api_usage_endpoint
        #     ON api_usage_metrics (endpoint)
        # """)

        # cursor.execute("""
        #     CREATE INDEX IF NOT EXISTS idx_api_usage_model
        #     ON api_usage_metrics (model_used)
        # """)

        # cursor.execute("""
        #     CREATE INDEX IF NOT EXISTS idx_api_usage_session
        #     ON api_usage_metrics (session_id)
        # """)

        conn.commit()
        conn.close()
        print("✅ All tables created successfully!")

    except Exception as e:
        print(f"❌ Error creating tables: {e}")
        raise e


def create_api_usage_table():
    """Create only the API usage tracking table"""
    try:
        config = get_snowflake_config()
        #print("[DEBUG] Snowflake config:", config)
        conn = snowflake.connector.connect(**config)
        cursor = conn.cursor()

        print("Creating API usage tracking table...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS api_usage_metrics (
                usage_id VARCHAR(255) PRIMARY KEY,
                endpoint VARCHAR(255) NOT NULL,
                method VARCHAR(10) NOT NULL,
                status_code INTEGER NOT NULL,
                response_time_ms FLOAT NOT NULL,
                request_timestamp TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP(),
                session_id VARCHAR(255),
                user_ip VARCHAR(45),
                user_agent TEXT,
                model_used VARCHAR(100),
                tokens_input INTEGER DEFAULT 0,
                tokens_output INTEGER DEFAULT 0,
                tokens_total INTEGER DEFAULT 0,
                estimated_cost FLOAT DEFAULT 0.0,
                request_size_bytes INTEGER DEFAULT 0,
                response_size_bytes INTEGER DEFAULT 0,
                error_message TEXT,
                additional_metadata TEXT  -- JSON string for flexible metadata
            )
        """)

        # print("Creating indexes for API usage metrics...")
        # cursor.execute("""
        #     CREATE INDEX IF NOT EXISTS idx_api_usage_timestamp
        #     ON api_usage_metrics (request_timestamp)
        # """)

        # cursor.execute("""
        #     CREATE INDEX IF NOT EXISTS idx_api_usage_endpoint
        #     ON api_usage_metrics (endpoint)
        # """)

        # cursor.execute("""
        #     CREATE INDEX IF NOT EXISTS idx_api_usage_model
        #     ON api_usage_metrics (model_used)
        # """)

        # cursor.execute("""
        #     CREATE INDEX IF NOT EXISTS idx_api_usage_session
        #     ON api_usage_metrics (session_id)
        # """)

        conn.commit()
        conn.close()
        print("✅ API usage tracking table created successfully!")

    except Exception as e:
        print(f"❌ Error creating API usage table: {e}")
        raise e


if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1 and sys.argv[1] == "api_usage":
        create_api_usage_table()
    else:
        create_tables()
