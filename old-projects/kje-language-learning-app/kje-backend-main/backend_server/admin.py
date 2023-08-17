from django.contrib import admin
from .models import JSentences, JSentenceSplit, KJESentences, KJESentenceSplit, Alphabet, J6kSentences, J6kSplit,  KSentences, KSentenceSplit

# Register your models here.


admin.site.register(JSentences)
admin.site.register(JSentenceSplit)
admin.site.register(KJESentences)
admin.site.register(KJESentenceSplit)
admin.site.register(Alphabet)

admin.site.register(J6kSentences)
admin.site.register(J6kSplit)

admin.site.register(KSentences)
admin.site.register(KSentenceSplit)
