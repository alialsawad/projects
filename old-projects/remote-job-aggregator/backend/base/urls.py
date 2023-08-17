from django.urls import path
from . import views
from .views import PostImageView


urlpatterns = [
    path('get-jobs/<path:website>', views.jobsBoard, name='jobsBoard'),
    path('login', views.login, name="login"),
    path('user-auth', views.loggedInUser, name="loggedInUser"),
    path('logout', views.logout, name="logout"),
    path('skills', PostImageView.as_view(), name='skills'),
    path('images/<user>', views.getImage, name='images'),
    path('removeImage/<int:id>/<path:user>',
         views.removeImage, name='removeImage'),
    path('profile-markdown/<path:user>',
         views.profilePageMarkdown, name='profile-markdown'),
    path('saved-markdown/<path:user>',
         views.getMarkdown, name='saved-markdown'),
    path('post-job/<path:user>', views.postJob, name='post-job'),
    path('view-job/<str:id>', views.viewJob, name='view-job'),
    path('apply/<str:email>/<str:jobId>', views.apply, name='apply'),
    path('check-applicant/<path:email>/<path:jobId>',
         views.checkApplicant, name='check-applicant'),
    path('get-job-list/<path:email>',
         views.getJobList, name='get-job-list'),
    path('applicants/<path:jobId>',
         views.getApplicantsList, name='applicants'),

]
