from rest_framework import serializers
from .models import HomeCnc, Projects, Users
from .utils import format_publications


class CncNavbarSerializer(serializers.ModelSerializer):
    class Meta:
        model = HomeCnc
        fields = ['name', 'getname']


class CncTextSerializer(serializers.ModelSerializer):
    class Meta:
        model = HomeCnc
        fields = ['text']


class CncProjectsSerializer(serializers.ModelSerializer):
    formatted_publications = serializers.SerializerMethodField()

    class Meta:
        model = Projects
        fields = ['id', 'projectname', 'description', 'formatted_publications']

    @staticmethod
    def get_formatted_publications(obj):
        publications = obj.publications.filter(vis=True).order_by('-year').values()
        return format_publications(publications)


class UsersSerializer(serializers.Serializer):
    class Meta:
        model = Users
        fields = ['id', 'username', 'info', 'tablename', 'role', 'externalpublications']


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})

