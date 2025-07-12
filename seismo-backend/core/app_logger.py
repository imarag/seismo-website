import logging


class AppLogger:
    def __init__(
        self,
        name: str = __name__,
        level: str = "INFO",
        log_format: str = "%(asctime)s — %(levelname)s — %(message)s",
        date_format: str = "%Y-%m-%d %H:%M:%S",
    ) -> None:
        self.name = name
        self.level = level
        self.date_format = date_format
        self.log_format = log_format

        self.initialize_logger()

    def initialize_logger(self) -> None:
        self.logger = logging.getLogger(self.name)
        self.logger.setLevel(self.level)

        if not self.logger.handlers:
            self.add_stream_handler()

    def get_formatter(self) -> logging.Formatter:
        """Return a standard formatter."""
        return logging.Formatter(self.log_format, datefmt=self.date_format)

    def add_handler(self, handler: logging.Handler) -> None:
        self.logger.addHandler(handler)

    def add_stream_handler(self) -> None:
        """Add a stream handler (console)."""
        console_handler = logging.StreamHandler()
        console_handler.setFormatter(self.get_formatter())
        self.add_handler(console_handler)

    def get_logger(self) -> logging.Logger:
        """Return the configured logger."""
        return self.logger
