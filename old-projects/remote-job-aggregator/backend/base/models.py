from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.
from django.core.exceptions import ValidationError


class Job(models.Model):
    id = models.CharField(primary_key=True, max_length=500)
    application_url = models.URLField(max_length=600)
    title = models.CharField(max_length=200, blank=True, null=True)
    company_name = models.CharField(max_length=200, blank=True, null=True)
    category = models.CharField(max_length=200, blank=True, null=True)
    job_type = models.CharField(max_length=200, blank=True, null=True)
    job_salary = models.CharField(max_length=200, blank=True, null=True)
    job_description = models.TextField()
    candidate_required_location = models.CharField(
        max_length=200, blank=True, null=True)
    publication_date = models.DateTimeField()


class User(AbstractUser):
    name = models.CharField(max_length=255)
    email = models.CharField(max_length=500, unique=True)
    user_dp = models.URLField(blank=True, null=True)
    password = models.CharField(max_length=500)
    token = models.CharField(max_length=500, blank=True, null=True)
    first_name = None
    last_name = None
    username = None

    REQUIRED_FIELDS = []
    USERNAME_FIELD = 'email'


def upload_to(instance, filename):
    return 'media/{filename}'.format(filename=filename)


def image_size(value):
    limit = 1 * 6200 * 6200
    if value.size > limit:
        raise ValidationError('File Too Large')
    return value


class Image(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    image = models.ImageField(upload_to=upload_to, validators=[image_size, ])
    imageName = models.CharField(max_length=500)


class ProfileMarkdown(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    markdown_text = models.TextField()


class RemoJobs(models.Model):
    id = models.CharField(max_length=900, primary_key=True)
    post_owner = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='post_owner')
    applied_users = models.ManyToManyField(User)
    title = models.CharField(max_length=200, blank=False, null=False)
    company_name = models.CharField(max_length=200, blank=False, null=False)
    category = models.CharField(max_length=200, blank=False, null=False)
    skills = models.CharField(max_length=600, blank=False, null=False)
    job_type = models.CharField(max_length=200, blank=False, null=False)
    job_salary = models.CharField(max_length=200, blank=True, null=True)
    job_description = models.TextField()
    candidate_required_location = models.CharField(
        max_length=200, blank=False, null=False)
    publication_date = models.DateTimeField(auto_now_add=True)
