#!/usr/bin/env python3
"""
Utility to reprocess existing documents with page-aware processing
"""

import asyncio
import boto3
from services.embedding_service import EmbeddingService
from services.file_service import FileService
from utils.snowflake_setup import get_snowflake_connection
import os
from dotenv import load_dotenv

load_dotenv()

async def reprocess_document(doc_id: str, filename: str, s3_key: str):
    """Reprocess a single document with page-aware processing"""
    try:
        print(f"🔄 Reprocessing: {filename}")
        
        # Download file from S3
        s3_client = boto3.client('s3')
        bucket_name = os.getenv('S3_BUCKET_NAME')
        
        response = s3_client.get_object(Bucket=bucket_name, Key=s3_key)
        file_content = response['Body'].read()
        
        # Determine file type
        file_type = filename.split('.')[-1].lower() if '.' in filename else 'unknown'
        
        # Initialize embedding service
        embedding_service = EmbeddingService()
        
        # Delete existing chunks for this document
        conn = get_snowflake_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM document_chunks WHERE doc_id = %s", (doc_id,))
        conn.commit()
        conn.close()
        
        print(f"🗑️ Deleted old chunks for {filename}")
        
        # Reprocess with page-aware method
        result = await embedding_service.process_document_with_pages(
            doc_id=doc_id,
            file_content=file_content,
            file_type=file_type,
            filename=filename
        )
        
        print(f"✅ Reprocessed {filename}: {result['chunks_created']} chunks across {result['pages_processed']} pages")
        return True
        
    except Exception as e:
        print(f"❌ Error reprocessing {filename}: {e}")
        return False

async def reprocess_all_documents():
    """Reprocess all documents in the system"""
    print("🚀 Starting document reprocessing...")
    
    conn = get_snowflake_connection()
    cursor = conn.cursor()
    
    try:
        # Get all processed documents
        cursor.execute("""
            SELECT doc_id, filename, s3_key
            FROM documents
            WHERE status = 'processed'
            ORDER BY upload_timestamp DESC
        """)
        
        documents = cursor.fetchall()
        
        if not documents:
            print("❌ No documents found to reprocess")
            return
            
        print(f"📊 Found {len(documents)} documents to reprocess")
        
        success_count = 0
        for doc_id, filename, s3_key in documents:
            success = await reprocess_document(doc_id, filename, s3_key)
            if success:
                success_count += 1
                
        print(f"✅ Reprocessing complete: {success_count}/{len(documents)} successful")
        
    except Exception as e:
        print(f"❌ Error during reprocessing: {e}")
    finally:
        conn.close()

async def reprocess_specific_document(filename_pattern: str):
    """Reprocess documents matching a specific filename pattern"""
    print(f"🔍 Looking for documents matching: {filename_pattern}")
    
    conn = get_snowflake_connection()
    cursor = conn.cursor()
    
    try:
        # Get documents matching the pattern
        cursor.execute("""
            SELECT doc_id, filename, s3_key
            FROM documents
            WHERE status = 'processed' AND filename LIKE %s
            ORDER BY upload_timestamp DESC
        """, (f"%{filename_pattern}%",))
        
        documents = cursor.fetchall()
        
        if not documents:
            print(f"❌ No documents found matching '{filename_pattern}'")
            return
            
        print(f"📊 Found {len(documents)} matching documents:")
        for _, filename, _ in documents:
            print(f"  - {filename}")
            
        confirm = input("\nProceed with reprocessing? (y/N): ")
        if confirm.lower() != 'y':
            print("❌ Cancelled")
            return
        
        success_count = 0
        for doc_id, filename, s3_key in documents:
            success = await reprocess_document(doc_id, filename, s3_key)
            if success:
                success_count += 1
                
        print(f"✅ Reprocessing complete: {success_count}/{len(documents)} successful")
        
    except Exception as e:
        print(f"❌ Error during reprocessing: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1:
        # Reprocess specific document
        pattern = sys.argv[1]
        asyncio.run(reprocess_specific_document(pattern))
    else:
        # Show options
        print("📋 Document Reprocessing Utility")
        print("Usage:")
        print("  python reprocess_documents.py                    # Show this help")
        print("  python reprocess_documents.py RESEARCH           # Reprocess documents containing 'RESEARCH'")
        print("  python reprocess_documents.py all                # Reprocess all documents")
        
        if len(sys.argv) == 1:
            choice = input("\nEnter document name pattern (or 'all' for all documents): ")
            if choice.lower() == 'all':
                asyncio.run(reprocess_all_documents())
            elif choice.strip():
                asyncio.run(reprocess_specific_document(choice.strip()))
            else:
                print("❌ No pattern provided")
