from django.core import serializers as DjangoSerializer
from django.http import HttpResponse, JsonResponse
from datetime import timedelta, datetime
import json
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, renderer_classes
from rest_framework.renderers import JSONRenderer, TemplateHTMLRenderer
from .serializers import ImageSerializer
from rest_framework import generics
from rest_framework.parsers import MultiPartParser, FormParser

from rest_framework import exceptions
from rest_framework.response import Response

from .auth import create_access_token, create_refresh_token
from .models import User, ProfileMarkdown, Image, Job, RemoJobs

from google.oauth2 import id_token
from google.auth.transport.requests import Request as GoogleRequest
from django.core.serializers.json import DjangoJSONEncoder


def jobsBoard(request, website):
    if website == 'remotive':
        qs = Job.objects.all().order_by('-publication_date')
        currentDate = datetime.today() - timedelta(days=31)
        formatDate = currentDate.strftime(
            '%Y-%m-%dT%H:%M:%S.%fZ')
        byDate = qs.filter(publication_date__gte=formatDate)
        try:
            jobs = byDate
        except:
            return False
        qsJSON = DjangoSerializer.serialize('json', jobs)
        return HttpResponse(qsJSON, content_type='application/json')
    else:
        qs = RemoJobs.objects.all().order_by('-publication_date')
        currentDate = datetime.today() - timedelta(days=31)
        formatDate = currentDate.strftime(
            '%Y-%m-%dT%H:%M:%S.%fZ')
        byDate = qs.filter(publication_date__gte=formatDate)
        try:
            jobs = byDate
        except:
            return False
        qsJSON = DjangoSerializer.serialize('json', jobs)
        return HttpResponse(qsJSON, content_type='application/json')


@csrf_exempt
@api_view(('POST', 'GET'))
@renderer_classes((TemplateHTMLRenderer, JSONRenderer))
def login(request):

    data = json.loads(request.body.decode('utf-8'))
    token = data['token']

    googleUser = id_token.verify_token(token, GoogleRequest())
    if not googleUser:
        raise exceptions.AuthenticationFailed('unauthenticated')

    user = User.objects.filter(email=googleUser['email']).first()

    if not user:
        user = User.objects.create(
            name=googleUser['name'],
            email=googleUser['email'],
            user_dp=googleUser['picture']
        )
        user.set_password(token)
        user.save()

    access_token = create_access_token(user.id)
    refresh_token = create_refresh_token(user.id)

    userInDB = User.objects.get(email=googleUser['email'])
    userInDB.token = refresh_token
    userInDB.save()
    response = Response()
    response.set_cookie(key='refresh_token',
                        value=refresh_token, httponly=True)
    response.data = {
        'token': access_token,
        "name": userInDB.name,
        "dp": userInDB.user_dp,
        "email": userInDB.email,
        "db_user": userInDB.id
    }
    return response


@csrf_exempt
def loggedInUser(request):
    try:
        cookie = request.COOKIES['refresh_token']
        user = User.objects.filter(token=cookie).first()
        data = {"name": user.name, "email": user.email,
                "dp": user.user_dp, "db_user": user.id}
        return JsonResponse(data)
    except:
        raise exceptions.AuthenticationFailed('unauthenticated')


@csrf_exempt
@api_view(('GET',))
@renderer_classes((TemplateHTMLRenderer, JSONRenderer))
def logout(request):
    refresh_token = request.COOKIES.get('refresh_token')
    User.objects.filter(token=refresh_token).update(token=None)

    response = Response()
    response.delete_cookie(key='refresh_token')
    response.data = {
        'message': 'success'
    }

    return response


class PostImageView(generics.CreateAPIView):
    parser_classes = [MultiPartParser, FormParser]
    serializer_class = ImageSerializer


def getImage(request, user):
    userId = User.objects.get(email=user)
    images = Image.objects.filter(owner=userId)
    img_json = DjangoSerializer.serialize('json', images)
    return HttpResponse(img_json, content_type='application/json')


def removeImage(request, id, user):
    Image.objects.get(pk=id).image.delete(save=True)
    Image.objects.get(pk=id).delete()
    return getImage(request, user)


@csrf_exempt
@api_view(('POST',))
@renderer_classes((TemplateHTMLRenderer, JSONRenderer))
def profilePageMarkdown(request, user):
    try:
        markdown_user = User.objects.get(pk=user)
    except:
        markdown_user = User.objects.get(email=user)

    data = json.loads(request.body.decode('utf-8'))
    text = data['text']
    try:
        ProfileMarkdown.objects.filter(
            user=markdown_user).delete()
        db_markdown = ProfileMarkdown(user=markdown_user, markdown_text=text)
        db_markdown.save()
    except:
        db_markdown = ProfileMarkdown(user=markdown_user, markdown_text=text)
        db_markdown.save()
    return getMarkdown(request, markdown_user)


def getMarkdown(request, user):
    try:
        rq_markdown = ProfileMarkdown.objects.get(user=user).markdown_text
    except:
        try:
            markdown_user = User.objects.get(pk=user)
        except:
            markdown_user = User.objects.get(email=user)
        rq_markdown = ProfileMarkdown.objects.get(
            user=markdown_user).markdown_text
    return HttpResponse(rq_markdown, content_type='application/json')


@csrf_exempt
@api_view(('POST',))
@renderer_classes((TemplateHTMLRenderer, JSONRenderer))
def postJob(request, user):
    postingUser = User.objects.get(pk=user)
    rqData = json.loads(request.body.decode('utf-8'))
    jobInfo = rqData['data']
    try:
        jobInfo['salary']
        addListing = RemoJobs(id=jobInfo['id'], post_owner=postingUser,
                              title=jobInfo['job_title'], company_name=jobInfo['company_name'], category=jobInfo['category'], skills=jobInfo['skills'], job_type=jobInfo['job_type'], job_salary=jobInfo['salary'], job_description=jobInfo['description'], candidate_required_location=jobInfo['location'])
        addListing.save()
    except:
        addListing = RemoJobs(id=jobInfo['id'], post_owner=postingUser,
                              title=jobInfo['job_title'], company_name=jobInfo['company_name'], category=jobInfo['category'], skills=jobInfo['skills'], job_type=jobInfo['job_type'], job_description=jobInfo['description'], candidate_required_location=jobInfo['location'])
        addListing.save()
    post = RemoJobs.objects.get(id=jobInfo['id'])
    responseData = [{'id': post.id}]

    return JsonResponse(responseData, safe=False)


@csrf_exempt
@api_view(('GET',))
@renderer_classes((TemplateHTMLRenderer, JSONRenderer))
def viewJob(request, id):
    try:
        post = RemoJobs.objects.get(id=id)
        responseData = [{'id': post.id,
                         'owner': post.post_owner.id,
                         'title': post.title,
                         'company_name': post.company_name,
                         'category': post.category,
                         'skills': post.skills,
                         'type': post.job_type,
                         'salary': post.job_salary,
                         'description': post.job_description,
                         'location': post.candidate_required_location,
                         'date': post.publication_date, }]
        return JsonResponse(responseData, safe=False)

    except:
        JsonResponse('Failed', safe=False)


def apply(request, jobId, email):
    applicant = User.objects.get(email=email)
    applyingTo = RemoJobs.objects.get(id=jobId)
    applyingTo.applied_users.add(applicant)
    return JsonResponse('success', safe=False)


def checkApplicant(request, email, jobId):
    job = RemoJobs.objects.get(id=jobId)
    print(email)
    print(jobId)
    if job.applied_users.filter(email=email).exists():
        return JsonResponse("success", safe=False)
    else:
        raise exceptions.AuthenticationFailed('unauthenticated')


@csrf_exempt
@api_view(('GET',))
@renderer_classes((TemplateHTMLRenderer, JSONRenderer))
def getJobList(request, email):
    jobList = RemoJobs.objects.filter(
        post_owner=email).order_by("-publication_date")
    qsJSON = DjangoSerializer.serialize('json', jobList)
    return HttpResponse(qsJSON, content_type='application/json')


@csrf_exempt
@api_view(('GET',))
@renderer_classes((TemplateHTMLRenderer, JSONRenderer))
def getApplicantsList(request, jobId):
    post = RemoJobs.objects.get(pk=jobId).applied_users.all()
    response = Response()
    response.data = {
        'usersInfo': []
    }
    for user in post:
        images = Image.objects.filter(owner=user)
        applicant = User.objects.get(email=user)
        img_json = DjangoSerializer.serialize('json', images)
        userEmail = user.email
        response.data['usersInfo'].append(
            [img_json, applicant.name, applicant.user_dp, userEmail])

    return response
