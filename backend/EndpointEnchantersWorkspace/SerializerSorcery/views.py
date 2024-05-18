import bibtexparser
import re

from django.contrib.auth import authenticate
from django.http import HttpResponse
from rest_framework.authtoken.admin import User
from rest_framework.authtoken.models import Token
from rest_framework.filters import OrderingFilter
from rest_framework.parsers import JSONParser

from .models import HomeCnc, Publications, Projects, BibtexChars, HomeMeicogsci, Aiseminar
from .serializers import (HomeCncNavbarSerializer, HomeCncTextSerializer, CncProjectsSerializer,
                          LoginSerializer, BibtexCharSerializer, HomeMeicogsciNavbarSerializer,
                          HomeMeicogsciTextSerializer, AiseminarSerializer, AdminFormProjectsSerializer, UserSerializer,
                          PublicationsSerializer, ProjectsSerializer, AdminPublicationsSerializer)

from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.views import APIView

from .utils import format_publications, format_publication_to_bibtex


# ModelViewSet is a higher-level abstraction that automatically provides implementations for various CRUD operations
# on a model. It is ideal for situations where you are directly creating, retrieving, updating, or deleting instances
# of a model and don't need to heavily customize the behavior of those operations.
class CncNavbar(viewsets.ModelViewSet):
    queryset = HomeCnc.objects.filter(primarytext=1).order_by('id')
    serializer_class = HomeCncNavbarSerializer


class CncFooter(viewsets.ModelViewSet):
    queryset = HomeCnc.objects.filter(name='footer')
    serializer_class = HomeCncTextSerializer


# APIView is a good choice when you need to implement custom behavior that doesn't necessarily fit into a standard
# CRUD (Create, Read, Update, Delete) pattern or when you need to handle non-standard HTTP methods
class CncGetHtmlContentByName(APIView):
    @staticmethod
    def get(request, name):
        try:
            if name == 'publications':
                publications = Publications.objects.filter(vis=True).order_by('-year').values()
                formatted_publications = format_publications(list(publications))
                return Response({'publications': formatted_publications})
            elif name == 'research':
                projects = Projects.objects.filter(vis=True).prefetch_related('publications')
                serializer = CncProjectsSerializer(projects, many=True)
                return Response({'projects': serializer.data})
            else:
                # fetches the entry where 'getname' matches the provided 'name'
                html_content = HomeCnc.objects.get(getname=name)  # returns a single instance, not a queryset
                serializer = HomeCncTextSerializer(html_content)

            return Response(serializer.data)
        except Exception as e:
            # generic exception for unforeseen errors
            return Response({'error': str(e)}, status=500)


class BaseGetBibtex(APIView):
    include_details = False

    @classmethod
    def get(cls, request, pub_id):
        try:
            publication = Publications.objects.get(id=pub_id)
            bibtex = format_publication_to_bibtex(publication, cls.include_details)
            return Response({'bibtex': bibtex})
        except Publications.DoesNotExist:
            return Response({'error': 'Publication not found'}, status=404)
        except Exception as e:
            return Response({'error': str(e)}, status=500)


class CncGetBibtex(BaseGetBibtex):
    include_details = True


class Login(APIView):
    @staticmethod
    def post(request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        username = serializer.validated_data['username']
        password = serializer.validated_data['password']

        user = authenticate(username=username, password=password)
        if user:
            token, _ = Token.objects.get_or_create(user=user)
            return Response({'token': token.key, 'id': user.id, 'username': user.username})
        return Response({'error': 'Invalid Credentials'}, status=403)


class Logout(APIView):
    @staticmethod
    def post(request):
        token = Token.objects.filter(user=request.user).first()
        if token:
            token.delete()
            return Response({"success": "Logged out successfully"}, status=200)
        return Response({"error": "Not logged in"}, status=403)


class AdminCncHomeNavbar(viewsets.ModelViewSet):
    queryset = HomeCnc.objects.order_by('id')
    serializer_class = HomeCncNavbarSerializer


class AdminCncHomeText(viewsets.ModelViewSet):
    queryset = HomeCnc.objects.all()
    serializer_class = HomeCncTextSerializer
    # lookup_field as 'getname', DRF will use this field to retrieve and update instances of
    # the model instead of the default primary key
    lookup_field = 'getname'
    # this is a list of allowed HTTP method names that this view will accept
    http_method_names = ['get', 'put']


class AdminCogSciHomeNavbar(viewsets.ModelViewSet):
    queryset = HomeMeicogsci.objects.order_by('id')
    serializer_class = HomeMeicogsciNavbarSerializer


class AdminCogSciHomeText(viewsets.ModelViewSet):
    queryset = HomeMeicogsci.objects.all()
    serializer_class = HomeMeicogsciTextSerializer
    lookup_field = 'getname'
    http_method_names = ['get', 'put']


class AdminBibtexChars(viewsets.ModelViewSet):
    queryset = BibtexChars.objects.all().order_by('-id')
    serializer_class = BibtexCharSerializer


class AdminAiSeminar(viewsets.ModelViewSet):
    queryset = Aiseminar.objects.all().order_by('-id')
    serializer_class = AiseminarSerializer


class AdminCncProjects(viewsets.ModelViewSet):
    queryset = Projects.objects.all().order_by('-id')
    serializer_class = AdminFormProjectsSerializer


class AdminUserList(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-id')
    serializer_class = UserSerializer
    http_method_names = ['get']


class AdminProjectsList(viewsets.ModelViewSet):
    queryset = Projects.objects.all().order_by('-id')
    serializer_class = ProjectsSerializer
    http_method_names = ['get']


def get_model_by_db_table(db_table_name):
    from django.apps import apps
    for model in apps.get_models():
        if model._meta.db_table == db_table_name:
            return model
    return None


def get_user_and_table(request):
    username = request.GET.get('username')
    try:
        user = User.objects.get(username=username)
        return user, user.tablename
    except User.DoesNotExist:
        return Response({'error': 'User not found.'}, status=404)


class AdminMyHomeNavbar(APIView):
    @staticmethod
    def get(request):
        user, tablename = get_user_and_table(request)
        if isinstance(user, Response):  # Check if user fetching failed
            return user

        model = get_model_by_db_table(tablename)
        if not model:
            return Response({'error': 'Users table not found.'}, status=404)

        data = model.objects.values('name', 'getname').order_by('id')
        return Response({'data': data}, status=200)


class AdminMyHomeData(APIView):
    @staticmethod
    def get_user_and_model(request):
        user, tablename = get_user_and_table(request)
        if isinstance(user, Response):
            return user, None

        model = get_model_by_db_table(tablename)
        if not model:
            return Response({'error': 'Table not found.'}, status=404), None

        return None, model

    def get(self, request):
        error_response, model = self.get_user_and_model(request)
        if error_response:
            return error_response

        getname = request.GET.get('getname')
        data = model.objects.values('text', 'has_left').filter(getname=getname).first()
        return Response({'data': data}, status=200)

    def put(self, request):
        error_response, model = self.get_user_and_model(request)
        if error_response:
            return error_response

        getname = request.GET.get('getname')
        obj = model.objects.filter(getname=getname).first()
        if not obj:
            return Response({'error': 'Object not found.'}, status=404)

        data = JSONParser().parse(request)
        for field in ['text', 'has_left']:
            if field in data:
                setattr(obj, field, data[field])
        obj.save()
        return Response({'message': 'Data fully updated successfully.'}, status=200)


class AdminGetInsertData(APIView):
    @staticmethod
    def get(request, username):
        try:
            user = User.objects.get(username=username)
            user_id = user.id
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)

        users_publications = Publications.objects.filter(userxpublication__user_id=user_id)
        user_pub_serializer = PublicationsSerializer(users_publications, many=True)

        users_projects = Projects.objects.filter(userxproject__user__id=user_id)
        users_proj_serializer = ProjectsSerializer(users_projects, many=True)

        projects = Projects.objects.all().order_by('id')
        projects_serializer = ProjectsSerializer(projects, many=True)

        users = User.objects.all().order_by('id')
        users_serializer = UserSerializer(users, many=True)

        return Response({
            'users_publications': user_pub_serializer.data,
            'users_projects': users_proj_serializer.data,
            'all_projects': projects_serializer.data,
            'all_users': users_serializer.data
        })

    @staticmethod
    def post(request):
        project_ids = request.data.get('project_ids', [])
        user_ids = request.data.get('user_ids', [])

        queries = {}
        if project_ids:
            queries['projects__id__in'] = project_ids
        if user_ids:
            queries['users__id__in'] = user_ids
        queries['vis'] = True

        publications = Publications.objects.filter(**queries).distinct().values()

        formatted_publications = format_publications(list(publications))
        return Response(formatted_publications, status=200)


class AdminPublications(viewsets.ModelViewSet):
    queryset = Publications.objects.all().order_by('id')
    serializer_class = AdminPublicationsSerializer
    filter_backends = [OrderingFilter]
    ordering_fields = ['id', 'vis', 'ptype', 'name', 'author', 'year']


BIBTEX_TO_MODEL_FIELD_MAP = {
    'ID': 'name',
}

TYPE_MAPPING = {
    'book': 'book',
    'article': 'article',
    'inproceedings': 'inproceedings',
    'incollection': 'incollection',
    'inbook': 'inbook',
    'techreport': 'techreport',
    'mastersthesis': 'mastersthesis',
    'phdthesis': 'phdthesis',
    'misc': 'misc',
    'unpublished': 'unpublished'
}


class AdminProcessBibtexs(APIView):

    @staticmethod
    def generate_variations(bibcode):
        base_bibcode = bibcode[1:-1]
        variations = {bibcode, base_bibcode}
        return variations

    def replace_bibcodes(self, latex_string):
        mappings = BibtexChars.objects.all().values('char', 'bibcode')

        char_to_variations = {}  # dictionary to store the mapping from characters to their variations
        for mapping in mappings:
            variations = self.generate_variations(mapping['bibcode'])
            char_to_variations[mapping['char']] = variations

        all_variations = [(var, char) for char, vars in char_to_variations.items() for var in
                          sorted(vars, reverse=True)]

        for variation, char in all_variations:
            latex_string = latex_string.replace(variation, char)

        return latex_string

    def post(self, request):
        bibtex_data = self.replace_bibcodes(request.data.get('bibtexContent'))
        print(bibtex_data)
        try:
            bib_database = bibtexparser.loads(bibtex_data)
            for entry in bib_database.entries:
                self.process_bibtex_entry(entry)
            return Response({"message": "BibTeX data processed successfully"}, status=200)
        except Exception as e:
            return Response({"error": str(e)}, status=400)

    def process_bibtex_entry(self, entry):
        title = entry.get('title').strip()
        entry_type = TYPE_MAPPING.get(entry.get('ENTRYTYPE'), 'misc')
        try:
            publication = Publications.objects.get(title=title)
            publication.ptype = entry_type
            self.update_publication(publication, entry)
        except Publications.DoesNotExist:
            self.create_publication(entry, entry_type)

    @staticmethod
    def update_publication(publication, entry):
        for key, value in entry.items():
            model_key = BIBTEX_TO_MODEL_FIELD_MAP.get(key, key)
            if hasattr(publication, model_key):
                setattr(publication, model_key, value.strip())
        publication.save()

    @staticmethod
    def create_publication(entry, entry_type):
        publication = Publications(vis=False, ptype=entry_type)
        for key, value in entry.items():
            model_key = BIBTEX_TO_MODEL_FIELD_MAP.get(key, key)
            if hasattr(publication, model_key):
                setattr(publication, model_key, value.strip())
        publication.save()


class AdminGetBibtex(BaseGetBibtex):
    pass


class AdminExportBibtexs(APIView):
    @staticmethod
    def post(request):
        user_ids = request.data.get('userIds', [])
        project_ids = request.data.get('projectIds', [])

        queries = {}
        if user_ids:
            queries['users__id__in'] = user_ids
        if project_ids:
            queries['projects__id__in'] = project_ids

        publications = Publications.objects.filter(**queries).distinct()
        bibtex_entries = [format_publication_to_bibtex(pub) for pub in publications]
        bibtex_string = '\n\n'.join(bibtex_entries)

        return HttpResponse(bibtex_string, content_type="text/plain; charset=utf-8")
