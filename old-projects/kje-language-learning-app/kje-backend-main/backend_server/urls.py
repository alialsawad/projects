from django.urls import path
from . import views

urlpatterns = [


    # Alphabet
    path('alphabet/<writingSystem>', views.getAlphabet, name='getAlphabet'),

    # Shared-Routers
    path("lesson/<topic>/<pageNumber>",
         views.getLesson, name="getLesson"),



    # Japanese Lessons Helpers
    # path('translate', views.translate, name='translate'),




    ### Populators ###
    path("populate", views.Populate, name="populate"),
    #     path("add-progress",
    #          views.addProgress, name="setProgress"),
    #     path('convert-script', views.convertScript, name='convertScript'),
    # path("j6kPopulate", views.j6kPopulate, name="j6kPopulate"),
]
