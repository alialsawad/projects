from django.db import models
from django.contrib.auth.models import AbstractUser


class Alphabet(models.Model):
    katakana = models.JSONField(unique=True)
    hiragana = models.JSONField(unique=True)
    hangul = models.JSONField(unique=True)


# KJE

class KJESentences(models.Model):
    japaneseSentence = models.JSONField()
    koreanSentence = models.JSONField()
    englishSentence = models.TextField()
    koreanWord = models.TextField()
    japaneseWord = models.TextField()
    englishWord = models.TextField()
    sentenceNumber = models.IntegerField(unique=True)


class KJESentenceSplit(models.Model):
    sentence = models.OneToOneField(KJESentences, on_delete=models.CASCADE)
    japaneseSentence = models.JSONField()
    koreanSentence = models.JSONField()


# Japanese Lessons


class JSentences(models.Model):
    lessonSentence = models.JSONField()
    sentenceNumber = models.IntegerField(unique=True)
    englishSentence = models.TextField()


class JSentenceSplit(models.Model):
    sentence = models.OneToOneField(JSentences, on_delete=models.CASCADE)
    sentenceSplit = models.JSONField()


# K-Conversations

class KSentences(models.Model):
    lessonSentence = models.JSONField()
    sentenceNumber = models.IntegerField(unique=True)
    englishSentence = models.TextField()


class KSentenceSplit(models.Model):
    sentence = models.OneToOneField(KSentences, on_delete=models.CASCADE)
    sentenceSplit = models.JSONField()


# J1-6k


class J6kSentences(models.Model):
    japaneseWord = models.TextField()
    englishWord = models.TextField()
    sentenceOne = models.JSONField()
    englishSentenceOne = models.TextField()
    sentenceTwo = models.JSONField()
    englishSentenceTwo = models.TextField()
    sentenceThree = models.JSONField()
    englishSentenceThree = models.TextField()
    sentenceNumber = models.IntegerField(unique=True)


class J6kSplit(models.Model):
    sentence = models.OneToOneField(
        J6kSentences, on_delete=models.CASCADE)
    sentenceOne_split = models.JSONField()
    sentenceTwo_split = models.JSONField()
    sentenceThree_split = models.JSONField()
