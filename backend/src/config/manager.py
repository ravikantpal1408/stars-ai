import os
from functools import lru_cache
from backend.src.config.settings.base import BackendBaseSettings
from backend.src.config.settings.development import BackendDevSettings
from backend.src.config.settings.environment import Environment

class BackendSettingsFactory:
    def __init__(self, environment: str):
        self.environment = environment

    def __call__(self) -> BackendBaseSettings:
        # Check if the environment matches 'development' or 'DEV'
        if self.environment.lower() in (Environment.DEVELOPMENT.value.lower(), "dev"):
            return BackendDevSettings()
        
        # Default fallback to Base settings if others aren't ready
        return BackendBaseSettings()

@lru_cache()
def get_settings() -> BackendBaseSettings:
    # Use standard os.getenv instead of decouple. 
    # This is built into Python and never fails with AttributeError.
    env = os.getenv("ENVIRONMENT", "DEV")
    return BackendSettingsFactory(environment=env)()

# Initialize the settings object
settings: BackendBaseSettings = get_settings()