"""
Logging configuration for ComplianceCheckpoint Backend
Provides structured logging with status indicators
"""
import logging
import sys
from datetime import datetime
from enum import Enum
from typing import Optional
import json


class LogStatus(str, Enum):
    """Status indicators for log messages"""
    SUCCESS = "✅"
    ERROR = "❌"
    WARNING = "⚠️"
    INFO = "ℹ️"
    DEBUG = "🔍"
    PENDING = "⏳"
    AUTH = "🔐"
    DATABASE = "🗄️"
    API = "🌐"
    STARTUP = "🚀"
    SHUTDOWN = "🛑"


class ColoredFormatter(logging.Formatter):
    """Custom formatter with colors and status indicators"""
    
    COLORS = {
        'DEBUG': '\033[36m',     # Cyan
        'INFO': '\033[32m',      # Green
        'WARNING': '\033[33m',   # Yellow
        'ERROR': '\033[31m',     # Red
        'CRITICAL': '\033[35m',  # Magenta
        'RESET': '\033[0m',      # Reset
    }
    
    def format(self, record: logging.LogRecord) -> str:
        # Add timestamp
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S.%f')[:-3]
        
        # Get color for level
        color = self.COLORS.get(record.levelname, self.COLORS['RESET'])
        reset = self.COLORS['RESET']
        
        # Get status indicator
        status = getattr(record, 'status', None)
        if status:
            status_str = f" {status.value}" if isinstance(status, LogStatus) else f" {status}"
        else:
            status_map = {
                'DEBUG': LogStatus.DEBUG.value,
                'INFO': LogStatus.INFO.value,
                'WARNING': LogStatus.WARNING.value,
                'ERROR': LogStatus.ERROR.value,
                'CRITICAL': LogStatus.ERROR.value,
            }
            status_str = f" {status_map.get(record.levelname, '')}"
        
        # Format the message
        formatted = f"{color}[{timestamp}]{status_str} [{record.levelname}] {record.name}: {record.getMessage()}{reset}"
        
        # Add exception info if present
        if record.exc_info:
            formatted += f"\n{self.formatException(record.exc_info)}"
        
        return formatted


class JSONFormatter(logging.Formatter):
    """JSON formatter for structured logging"""
    
    def format(self, record: logging.LogRecord) -> str:
        log_data = {
            "timestamp": datetime.now().isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
            "module": record.module,
            "function": record.funcName,
            "line": record.lineno,
        }
        
        # Add status if present
        status = getattr(record, 'status', None)
        if status:
            log_data["status"] = status.value if isinstance(status, LogStatus) else status
        
        # Add extra fields
        for key, value in record.__dict__.items():
            if key not in ['name', 'msg', 'args', 'created', 'filename', 'funcName',
                          'levelname', 'levelno', 'lineno', 'module', 'msecs',
                          'pathname', 'process', 'processName', 'relativeCreated',
                          'stack_info', 'exc_info', 'exc_text', 'thread', 'threadName',
                          'status', 'message']:
                log_data[key] = value
        
        # Add exception info if present
        if record.exc_info:
            log_data["exception"] = self.formatException(record.exc_info)
        
        return json.dumps(log_data)


def setup_logging(
    level: str = "INFO",
    json_format: bool = False,
    log_file: Optional[str] = None
) -> logging.Logger:
    """
    Setup application logging with colored console output and optional file logging
    
    Args:
        level: Logging level (DEBUG, INFO, WARNING, ERROR, CRITICAL)
        json_format: Use JSON format for logs
        log_file: Optional path to log file
    
    Returns:
        Configured logger instance
    """
    # Get root logger for the app
    logger = logging.getLogger("compliance_checkpoint")
    logger.setLevel(getattr(logging, level.upper(), logging.INFO))
    
    # Remove existing handlers
    logger.handlers.clear()
    
    # Console handler
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(logging.DEBUG)
    
    if json_format:
        console_handler.setFormatter(JSONFormatter())
    else:
        console_handler.setFormatter(ColoredFormatter())
    
    logger.addHandler(console_handler)
    
    # File handler (optional)
    if log_file:
        file_handler = logging.FileHandler(log_file)
        file_handler.setLevel(logging.DEBUG)
        file_handler.setFormatter(JSONFormatter())  # Always use JSON for file logs
        logger.addHandler(file_handler)
    
    return logger


def get_logger(name: str) -> logging.Logger:
    """Get a child logger with the given name"""
    return logging.getLogger(f"compliance_checkpoint.{name}")


# Convenience logging functions with status
def log_success(logger: logging.Logger, message: str, **kwargs):
    """Log a success message"""
    logger.info(message, extra={"status": LogStatus.SUCCESS, **kwargs})


def log_error(logger: logging.Logger, message: str, **kwargs):
    """Log an error message"""
    logger.error(message, extra={"status": LogStatus.ERROR, **kwargs})


def log_warning(logger: logging.Logger, message: str, **kwargs):
    """Log a warning message"""
    logger.warning(message, extra={"status": LogStatus.WARNING, **kwargs})


def log_auth(logger: logging.Logger, message: str, level: str = "info", **kwargs):
    """Log an authentication-related message"""
    getattr(logger, level)(message, extra={"status": LogStatus.AUTH, **kwargs})


def log_database(logger: logging.Logger, message: str, level: str = "info", **kwargs):
    """Log a database-related message"""
    getattr(logger, level)(message, extra={"status": LogStatus.DATABASE, **kwargs})


def log_api(logger: logging.Logger, message: str, level: str = "info", **kwargs):
    """Log an API-related message"""
    getattr(logger, level)(message, extra={"status": LogStatus.API, **kwargs})


def log_startup(logger: logging.Logger, message: str, **kwargs):
    """Log a startup message"""
    logger.info(message, extra={"status": LogStatus.STARTUP, **kwargs})


def log_shutdown(logger: logging.Logger, message: str, **kwargs):
    """Log a shutdown message"""
    logger.info(message, extra={"status": LogStatus.SHUTDOWN, **kwargs})
