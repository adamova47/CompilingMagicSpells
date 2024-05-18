from django.db import transaction, connection
from rest_framework import serializers
from .models import HomeCnc, Projects, Users, BibtexChars, HomeMeicogsci, Aiseminar, Userxproject, Publications
from .utils import format_publications


class BibtexCharSerializer(serializers.ModelSerializer):
    class Meta:
        model = BibtexChars
        fields = '__all__'


class AiseminarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Aiseminar
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ['id', 'first_name', 'last_name']


class AdminFormProjectsSerializer(serializers.ModelSerializer):
    users = UserSerializer(many=True, read_only=True)

    class Meta:
        model = Projects
        fields = ['id', 'tag', 'projectname', 'description', 'vis', 'users']

    def create(self, validated_data):
        user_ids = self.initial_data.get('users', [])
        try:
            with transaction.atomic():
                project = Projects.objects.create(**validated_data)
                self._update_user_associations(project, user_ids)
            return project
        except Exception as e:
            raise serializers.ValidationError({"error": str(e)})

    def update(self, instance, validated_data):
        user_ids = self.initial_data.get('users', [])
        try:
            with transaction.atomic():
                for attr, value in validated_data.items():
                    setattr(instance, attr, value)
                instance.save()
                self._update_user_associations(instance, user_ids)
            return instance
        except Exception as e:
            raise serializers.ValidationError({"error": str(e)})

    @staticmethod
    def _update_user_associations(project, user_ids):
        with connection.cursor() as cursor:
            Userxproject.objects.filter(project=project).delete()
            for user_id in user_ids:
                cursor.execute(
                    'INSERT INTO userxproject ("user", "project") VALUES (%s, %s)',
                    (user_id, project.id)
                )


class PublicationsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Publications
        fields = ['id', 'name']


class ProjectsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Projects
        fields = ['id', 'tag']


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
