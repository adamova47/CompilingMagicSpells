# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.contrib.auth.models import AbstractUser
from django.db import models


class Aiseminar(models.Model):
    id = models.BigAutoField(primary_key=True)
    date = models.DateField()
    time = models.TimeField(null=True, blank=True)
    lecturer = models.CharField(max_length=256)
    lecturerfrom = models.CharField(max_length=256, blank=True)
    url = models.CharField(max_length=256, blank=True)
    title = models.CharField(max_length=256)
    abstract = models.TextField()
    note = models.CharField(max_length=256, blank=True)

    class Meta:
        db_table = 'aiseminar'


class BibtexChars(models.Model):
    id = models.BigAutoField(primary_key=True)
    char = models.CharField(max_length=5)
    bibcode = models.CharField(max_length=10)

    class Meta:
        managed = False
        db_table = 'bibtex_chars'


class HomeBajka(models.Model):
    name = models.CharField(max_length=200)
    getname = models.CharField(max_length=200)
    text = models.TextField()
    has_left = models.BooleanField(db_column='has-left')  # Field renamed to remove unsuitable characters.
    primarytext = models.BooleanField()

    class Meta:
        managed = False
        db_table = 'home_bajka'


class HomeCnc(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=300)
    getname = models.CharField(max_length=200)
    text = models.TextField()
    primarytext = models.BooleanField()

    class Meta:
        managed = False
        db_table = 'home_cnc'


class HomeDeedee(models.Model):
    name = models.CharField(max_length=200)
    getname = models.CharField(max_length=200)
    text = models.TextField()
    has_left = models.BooleanField(db_column='has-left')  # Field renamed to remove unsuitable characters.
    primarytext = models.BooleanField()

    class Meta:
        managed = False
        db_table = 'home_deedee'


class HomeIgor(models.Model):
    name = models.CharField(max_length=200)
    getname = models.CharField(max_length=200)
    text = models.TextField()
    has_left = models.BooleanField(db_column='has-left')  # Field renamed to remove unsuitable characters.
    primarytext = models.BooleanField()

    class Meta:
        managed = False
        db_table = 'home_igor'


class HomeKik(models.Model):
    name = models.CharField(max_length=200)
    getname = models.CharField(max_length=200)
    text = models.TextField()
    has_left = models.BooleanField(db_column='has-left')  # Field renamed to remove unsuitable characters.
    primarytext = models.BooleanField()

    class Meta:
        managed = False
        db_table = 'home_kik'


class HomeLuba(models.Model):
    name = models.CharField(max_length=200)
    getname = models.CharField(max_length=200)
    text = models.TextField()
    has_left = models.BooleanField(db_column='has-left')  # Field renamed to remove unsuitable characters.
    primarytext = models.BooleanField()

    class Meta:
        managed = False
        db_table = 'home_luba'


class HomeLudo(models.Model):
    name = models.CharField(max_length=200)
    getname = models.CharField(max_length=200)
    text = models.TextField()
    has_left = models.BooleanField(db_column='has-left')  # Field renamed to remove unsuitable characters.
    primarytext = models.BooleanField()

    class Meta:
        managed = False
        db_table = 'home_ludo'


class HomeMartin(models.Model):
    name = models.CharField(max_length=200)
    getname = models.CharField(max_length=200)
    text = models.TextField()
    has_left = models.BooleanField(db_column='has-left')  # Field renamed to remove unsuitable characters.
    primarytext = models.BooleanField()

    class Meta:
        managed = False
        db_table = 'home_martin'


class HomeMatej(models.Model):
    name = models.CharField(max_length=200)
    getname = models.CharField(max_length=200)
    text = models.TextField()
    has_left = models.BooleanField(db_column='has-left')  # Field renamed to remove unsuitable characters.
    primarytext = models.BooleanField()

    class Meta:
        managed = False
        db_table = 'home_matej'


class HomeMeicogsci(models.Model):
    id = models.BigAutoField(primary_key=True)
    getname = models.CharField(max_length=200)
    name = models.CharField(max_length=300)
    text = models.TextField()
    primarytext = models.BooleanField()

    class Meta:
        managed = False
        db_table = 'home_meicogsci'


class HomeMeicogsciGallery(models.Model):
    id = models.BigAutoField(primary_key=True)
    albumname = models.CharField(max_length=200)
    getname = models.CharField(max_length=200)
    path = models.CharField(max_length=200)
    coverphoto = models.CharField(max_length=200)
    date = models.DateField()
    vis = models.SmallIntegerField()

    class Meta:
        managed = False
        db_table = 'home_meicogsci_gallery'


class HomePetog(models.Model):
    name = models.CharField(max_length=200)
    getname = models.CharField(max_length=200)
    text = models.TextField()
    has_left = models.BooleanField(db_column='has-left')  # Field renamed to remove unsuitable characters.
    primarytext = models.BooleanField()

    class Meta:
        managed = False
        db_table = 'home_petog'


class HomeTomas(models.Model):
    name = models.CharField(max_length=200)
    getname = models.CharField(max_length=200)
    text = models.TextField()
    has_left = models.BooleanField(db_column='has-left')  # Field renamed to remove unsuitable characters.
    primarytext = models.BooleanField()

    class Meta:
        managed = False
        db_table = 'home_tomas'


class Projects(models.Model):
    id = models.BigAutoField(primary_key=True)
    tag = models.CharField(max_length=100, blank=True)
    projectname = models.TextField(blank=True)
    description = models.TextField(blank=True)
    vis = models.BooleanField()
    publications = models.ManyToManyField('Publications', through='Projectxpublication', related_name='projects', blank=True)

    class Meta:
        managed = False
        db_table = 'projects'


class Projectxpublication(models.Model):
    project = models.ForeignKey('Projects', on_delete=models.CASCADE, db_column='project')
    publication = models.ForeignKey('Publications', on_delete=models.CASCADE, db_column='publication')

    class Meta:
        managed = False
        db_table = 'projectxpublication'
        unique_together = (('project', 'publication'),)


class Publications(models.Model):
    id = models.BigAutoField(primary_key=True)
    vis = models.BooleanField()
    ptype = models.CharField(max_length=200)
    name = models.CharField(max_length=300)
    address = models.TextField(blank=True)
    author = models.TextField()
    booktitle = models.TextField(blank=True)
    edition = models.TextField(blank=True)
    editor = models.TextField(blank=True)
    institution = models.TextField(blank=True)
    journal = models.TextField(blank=True)
    month = models.CharField(max_length=50, blank=True)
    note = models.TextField(blank=True)
    number = models.CharField(max_length=30, blank=True)
    organization = models.TextField(blank=True)
    pages = models.CharField(max_length=50, blank=True)
    publisher = models.TextField(blank=True)
    school = models.TextField(blank=True)
    series = models.TextField(blank=True)
    title = models.TextField()
    volume = models.TextField(blank=True)
    year = models.CharField(max_length=5)
    url = models.TextField(blank=True)

    class Meta:
        managed = False
        db_table = 'publications'


'''
class User(models.Model):
    id = models.BigAutoField(primary_key=True)
    username = models.CharField(max_length=200)
    password = models.CharField(max_length=50)
    firstname = models.CharField(max_length=200)
    surname = models.CharField(max_length=200)
    info = models.TextField()
    tablename = models.CharField(max_length=100)
    role = models.SmallIntegerField()
    externalpublications = models.SmallIntegerField()

    # many-to-many relationships
    projects = models.ManyToManyField('Projects', through='Userxproject', related_name='users', blank=True)
    publications = models.ManyToManyField('Publications', through='Userxpublication', related_name='users', blank=True)

    class Meta:
        managed = False
        db_table = 'users'
'''


class Users(AbstractUser):
    info = models.TextField()
    tablename = models.CharField(max_length=100)
    role = models.SmallIntegerField()
    externalpublications = models.SmallIntegerField()

    # many-to-many relationships
    projects = models.ManyToManyField('Projects', through='Userxproject', related_name='users', blank=True)
    publications = models.ManyToManyField('Publications', through='Userxpublication', related_name='users', blank=True)


class Userxproject(models.Model):
    user = models.ForeignKey('Users', on_delete=models.CASCADE, db_column='user')
    project = models.ForeignKey('Projects', on_delete=models.CASCADE, db_column='project')

    class Meta:
        managed = False
        db_table = 'userxproject'
        unique_together = (('user', 'project'),)


class Userxpublication(models.Model):
    user = models.ForeignKey('Users', on_delete=models.CASCADE, db_column='user')
    publication = models.ForeignKey('Publications', on_delete=models.CASCADE, db_column='publication')

    class Meta:
        managed = False
        db_table = 'userxpublication'
        unique_together = (('user', 'publication'),)
