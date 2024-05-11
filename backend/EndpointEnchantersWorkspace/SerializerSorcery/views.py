from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token

from .models import HomeCnc, Publications, Projects, BibtexChars, HomeMeicogsci, Aiseminar
from .serializers import (CncNavbarSerializer, HomeCncTextSerializer, CncProjectsSerializer, LoginSerializer,
                          AdminNavbarSerializer, BibtexCharSerializer, HomeMeicogsciNavbarSerializer,
                          HomeMeicogsciTextSerializer, AiseminarSerializer)

from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.views import APIView

from .utils import format_publications, format_publication_for_bibtex


# ModelViewSet is a higher-level abstraction that automatically provides implementations for various CRUD operations
# on a model. It is ideal for situations where you are directly creating, retrieving, updating, or deleting instances
# of a model and don't need to heavily customize the behavior of those operations.
class CncNavbar(viewsets.ModelViewSet):
    queryset = HomeCnc.objects.filter(primarytext=1).order_by('id')
    serializer_class = CncNavbarSerializer


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


class CncExportBib(APIView):
    @staticmethod
    def get(request, pub_id):
        try:
            publication = Publications.objects.get(id=pub_id)
            bibtex = format_publication_for_bibtex(publication)
            return Response({'bibtex': bibtex})
        except Publications.DoesNotExist:
            return Response({'error': 'Publication not found'}, status=404)
        except Exception as e:
            return Response({'error': str(e)}, status=500)


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
    serializer_class = AdminNavbarSerializer


class AdminCncHomeText(APIView):
    @staticmethod
    def get(request, getname):
        try:
            data = HomeCnc.objects.get(getname=getname)
            serializer = HomeCncTextSerializer(data)
            return Response({'data': serializer.data}, status=200)
        except HomeCnc.DoesNotExist:
            return Response({'error': 'CncHome table not found.'}, status=404)
        except Exception as e:
            return Response({'error': str(e)}, status=500)

    @staticmethod
    def post(request, getname):
        try:
            data = HomeCnc.objects.get(getname=getname)
            serializer = HomeCncTextSerializer(data, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=200)
            return Response(serializer.errors, status=400)
        except HomeCnc.DoesNotExist:
            return Response({'error': 'CncHome table not found.'}, status=404)
        except Exception as e:
            return Response({'error': str(e)}, status=500)


class AdminCogSciHomeNavbar(viewsets.ModelViewSet):
    queryset = HomeMeicogsci.objects.order_by('id')
    serializer_class = HomeMeicogsciNavbarSerializer


class AdminCogSciHomeText(APIView):
    @staticmethod
    def get(request, getname):
        try:
            data = HomeMeicogsci.objects.get(getname=getname)
            serializer = HomeMeicogsciTextSerializer(data)
            return Response({'data': serializer.data}, status=200)
        except HomeCnc.DoesNotExist:
            return Response({'error': 'CncHome table not found.'}, status=404)
        except Exception as e:
            return Response({'error': str(e)}, status=500)

    @staticmethod
    def post(request, getname):
        try:
            data = HomeMeicogsci.objects.get(getname=getname)
            serializer = HomeMeicogsciTextSerializer(data, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=200)
            return Response(serializer.errors, status=400)
        except HomeCnc.DoesNotExist:
            return Response({'error': 'CncHome table not found.'}, status=404)
        except Exception as e:
            return Response({'error': str(e)}, status=500)


class AdminBibtexChars(APIView):
    @staticmethod
    def get(request):
        try:
            bibchars = BibtexChars.objects.all().order_by('-id')
            serializer = BibtexCharSerializer(bibchars, many=True)
            return Response(serializer.data, status=200)
        except BibtexChars.DoesNotExist:
            return Response({'error': 'BibtexChars table not found.'}, status=404)
        except Exception as e:
            return Response({'error': str(e)}, status=500)

    @staticmethod
    def post(request):
        serializer = BibtexCharSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)
        return Response(serializer.errors, status=400)

    @staticmethod
    def put(request, bib_id):
        bibchar = BibtexChars.objects.get(id=bib_id)
        serializer = BibtexCharSerializer(bibchar, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)
        return Response(serializer.errors, status=400)

    @staticmethod
    def delete(request, bib_id):
        bibchar = BibtexChars.objects.get(id=bib_id)
        bibchar.delete()
        return Response(status=200)


class AdminAiSeminar(APIView):
    @staticmethod
    def get(request):
        try:
            seminars = Aiseminar.objects.all().order_by('-id')
            serializer = AiseminarSerializer(seminars, many=True)
            return Response(serializer.data, status=200)
        except Aiseminar.DoesNotExist:
            return Response({'error': 'AiSeminar table not found.'}, status=404)
        except Exception as e:
            return Response({'error': str(e)}, status=500)

    @staticmethod
    def post(request):
        serializer = AiseminarSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)
        return Response(serializer.errors, status=400)

    @staticmethod
    def put(request, seminar_id):
        aiseminar = Aiseminar.objects.get(id=seminar_id)
        serializer = AiseminarSerializer(aiseminar, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)
        return Response(serializer.errors, status=400)

    @staticmethod
    def delete(request, seminar_id):
        aiseminar = Aiseminar.objects.get(id=seminar_id)
        aiseminar.delete()
        return Response(status=200)
