from rest_framework import serializers


class PlaceholderSerializer(serializers.Serializer):
    message = serializers.CharField(read_only=True)


