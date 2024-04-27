from rest_framework import serializers
from .models import HomeCnc, Projects, Users, BibtexChars, HomeMeicogsci, Aiseminar
from .utils import format_publications


class BibtexCharSerializer(serializers.ModelSerializer):
    class Meta:
        model = BibtexChars
        fields = '__all__'


class AiseminarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Aiseminar
        fields = '__all__'


class CncNavbarSerializer(serializers.ModelSerializer):
    class Meta:
        model = HomeCnc
        fields = ['name', 'getname']


class AdminNavbarSerializer(serializers.ModelSerializer):
    class Meta:
        model = HomeCnc
        fields = ['name', 'getname']


class HomeCncTextSerializer(serializers.ModelSerializer):
    class Meta:
        model = HomeCnc
        fields = ['text']


class HomeMeicogsciNavbarSerializer(serializers.ModelSerializer):
    class Meta:
        model = HomeMeicogsci
        fields = ['name', 'getname']


class HomeMeicogsciTextSerializer(serializers.ModelSerializer):
    class Meta:
        model = HomeMeicogsci
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
