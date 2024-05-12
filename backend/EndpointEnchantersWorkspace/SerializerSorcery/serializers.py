from rest_framework import serializers
from .models import HomeCnc, Projects, Users, BibtexChars, HomeMeicogsci, Aiseminar, Userxproject
from .utils import format_publications


class BibtexCharSerializer(serializers.ModelSerializer):
    class Meta:
        model = BibtexChars
        fields = '__all__'


class AiseminarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Aiseminar
        fields = '__all__'


class ProjectsSerializer(serializers.ModelSerializer):
    users = serializers.SerializerMethodField()

    class Meta:
        model = Projects
        fields = ['id', 'tag', 'projectname', 'description', 'vis', 'users']

    @staticmethod
    def get_users(obj):
        users = obj.users.all()
        return [{'id': user.id, 'username': user.username} for user in users]


class HomeCncNavbarSerializer(serializers.ModelSerializer):
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


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})
