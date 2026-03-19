from django.apps import AppConfig


class BaseConfig(AppConfig):
    name = 'base'
    
    def ready(self):
        """Register signals when the app is ready"""
        import base.signals
