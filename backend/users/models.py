from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    nickname = models.CharField(max_length=50, blank=True)
    bio = models.TextField(blank=True)

    def __str__(self) -> str:  # pragma: no cover
        return self.username


