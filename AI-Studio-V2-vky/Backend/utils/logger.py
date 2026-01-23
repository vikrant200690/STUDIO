import logging
import sys
import os
from datetime import datetime


def setup_logger(name: str = "ai_studio", level: str = "INFO"):
    """Setup enhanced logger with file and console output"""
    # Create logger
    logger = logging.getLogger(name)
    logger.setLevel(getattr(logging, level.upper()))

    # Clear existing handlers
    logger.handlers.clear()

    # Create formatters
    detailed_formatter = logging.Formatter(
        "%(asctime)s - %(name)s - %(levelname)s - %(funcName)s:%(lineno)d - %(message)s"
    )
    simple_formatter = logging.Formatter(
        "%(asctime)s - %(levelname)s - %(message)s"
    )

    # Console handler with simple format
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(logging.INFO)
    console_handler.setFormatter(simple_formatter)

    # File handler with detailed format
    try:
        os.makedirs("logs", exist_ok=True)
        file_handler = logging.FileHandler(
            f"logs/ai_studio_{datetime.now().strftime('%Y%m%d')}.log")
        file_handler.setLevel(logging.DEBUG)
        file_handler.setFormatter(detailed_formatter)
        logger.addHandler(file_handler)
    except Exception as e:
        print(f"Warning: Could not create file logger: {e}")

    # Add console handler
    logger.addHandler(console_handler)

    return logger


def get_logger(name: str = "ai_studio"):
    """Get a logger instance"""
    return logging.getLogger(name)
