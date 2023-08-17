from django.http import JsonResponse
from rest_framework import exceptions
from rest_framework.response import Response
from rest_framework.decorators import api_view, renderer_classes
from rest_framework.renderers import JSONRenderer, TemplateHTMLRenderer
from django.views.decorators.csrf import csrf_exempt
from deep_translator import GoogleTranslator
import csv

from .models import JSentences, JSentenceSplit, KJESentences, KJESentenceSplit, Alphabet, J6kSentences, J6kSplit, KSentences, KSentenceSplit

import json
from korean_romanizer.romanizer import Romanizer
import pykakasi
import uuid


import pandas as pd
import spacy
import spacy_fastlang
skip_structure = [
    '，',
    '．',
    '：',
    '；',
    '！',
    '？',
    '＂',
    '＇',
    '｀',
    '＾',
    '～',
    '￣',
    '＿',
    '＆',
    '＠',
    '＃',
    '％',
    '＋',
    '－',
    '＊',
    '＝',
    '＜',
    '＞',
    '（',
    '）',
    '［',
    '］',
    '｛',
    ' ｝',
    '｟',
    ' ｠',
    '｜',
    '￤',
    '／',
    '＼',
    '￢',
    '＄',
    '￡',
    '￠',
    '￦',
    '￥',
    '。',
    '？',
    '、',
    '.',
    '?',
    '!',
    ' ',
    ','
    '　',
    '\xa0'
]


@ csrf_exempt
@ api_view(('GET',))
@ renderer_classes((TemplateHTMLRenderer, JSONRenderer))
def Populate(request):
    AlphabetPopulator()
    Japanese6k()
    KJE()
    Convo_NLP()
    KConvo()
    return JsonResponse('Success', safe=False)


def AlphabetPopulator():
    df_letters_kata = pd.read_csv(
        '/home/oneeyedodin/Desktop/Language-backup/Alphabet/kata.csv')
    letter = {}
    for _, row in df_letters_kata.iterrows():
        letter[row['katakana']] = row['romaji']

    jsonKatakana = json.dumps(letter)
    letter = {}
    df_letters_hira = pd.read_csv(
        '/home/oneeyedodin/Desktop/Language-backup/Alphabet/hira.csv')
    for _, row in df_letters_hira.iterrows():
        letter[row['hiragana']] = row['romaji']
    jsonHiragana = json.dumps(letter)
    letter = {}
    df_letters_hangul = pd.read_csv(
        '/home/oneeyedodin/Desktop/Language-backup/Alphabet/Hangeul.csv')
    for _, row in df_letters_hangul.iterrows():
        letter[row['Hangeul']] = row['Romanization']
    jsonHangeul = json.dumps(letter)
    alphabet = Alphabet(katakana=jsonKatakana, hiragana=jsonHiragana,
                        hangul=jsonHangeul)
    alphabet.save()
    return JsonResponse('Success', safe=False)


def Convo_NLP():
    df = pd.read_csv(
        '/home/oneeyedodin/Desktop/Language-backup/J-Conversations/SortedConversations.csv')
    nlp = spacy.load("ja_core_news_lg")
    progress = 1
    for index, row in df.iterrows():
        doc = nlp(row['jap_sentence'])
        result = []
        sentence_dict = {}
        for token in doc:
            result.append(token.text)
            text_holder = [None for i in range(len(doc.text))]
            current_word = token.text
            if current_word in skip_structure:
                continue
            word_pos = doc.text.index(current_word)
            text_holder[word_pos] = current_word
            get_ancestors = token.ancestors
            for ancestor in get_ancestors:
                curr_ancestor = ancestor.text
                index = doc.text.index(curr_ancestor)
                text_holder[index] = curr_ancestor
            give_children = token.children
            for child in give_children:
                curr_child = child.text
                index = doc.text.index(curr_child)
                text_holder[index] = curr_child
            text_holder = [text for text in text_holder if text != None]
            if text_holder in sentence_dict.values():
                continue
            else:
                sentence_dict[token.text] = text_holder
        sentenceSplitJSON = json.dumps(sentence_dict)
        jsonString = json.dumps(result)
        sentence = JSentences(
            sentenceNumber=progress,
            englishSentence=row['en_sentence'],
            lessonSentence=jsonString)
        sentence.save()
        sentenceSplit = JSentenceSplit(
            sentence=sentence, sentenceSplit=sentenceSplitJSON)
        sentenceSplit.save()
        progress += 1
        print(f'{progress} Progress')
    print('>>>>>>>>>>DONE<<<<<<<<<<<<')
    return JsonResponse('Success', safe=False)


def Japanese6k():
    df = pd.read_csv(
        '/home/oneeyedodin/Desktop/Language-backup/J6k/j6k_combined.csv')

    nlp_j = spacy.load("ja_core_news_lg")
    progress = 1

    for index, row in df.iterrows():
        sentence_split_list = []

        if row['example-one_1'] != 'Empty':
            ds = ([], {}, nlp_j(row['example-one_1'].replace(' ', '')))
            sentence_split_list.append(ds)
        else:
            sentence_split_list.append(row['example-one_1'])

        for entry in sentence_split_list:
            if entry != 'Empty':
                result, sentence_dict, item = entry
                for token in item:
                    result.append(token.text)
                    text_holder = [None for i in range(len(item.text))]
                    current_word = token.text
                    if current_word in skip_structure:
                        continue
                    word_pos = item.text.index(current_word)
                    text_holder[word_pos] = current_word
                    get_ancestors = token.ancestors
                    for ancestor in get_ancestors:
                        curr_ancestor = ancestor.text
                        index = item.text.index(curr_ancestor)
                        text_holder[index] = curr_ancestor
                    give_children = token.children
                    for child in give_children:
                        curr_child = child.text
                        index = item.text.index(curr_child)
                        text_holder[index] = curr_child
                    text_holder = [
                        text for text in text_holder if text != None]
                    if text_holder in sentence_dict.values():
                        continue
                    else:
                        sentence_dict[token.text] = text_holder

        first_list = sentence_split_list

        sentence_split_list = []
        if row['example-two_1'] != 'Empty':
            ds = ([], {}, nlp_j(row['example-two_1'].replace(' ', '')))
            sentence_split_list.append(ds)
        else:
            sentence_split_list.append(row['example-two_1'])

        for entry in sentence_split_list:
            if entry != 'Empty':
                result, sentence_dict, item = entry
                for token in item:
                    result.append(token.text)
                    text_holder = [None for i in range(len(item.text))]
                    current_word = token.text
                    if current_word in skip_structure:
                        continue
                    word_pos = item.text.index(current_word)
                    text_holder[word_pos] = current_word
                    get_ancestors = token.ancestors
                    for ancestor in get_ancestors:
                        curr_ancestor = ancestor.text
                        index = item.text.index(curr_ancestor)
                        text_holder[index] = curr_ancestor
                    give_children = token.children
                    for child in give_children:
                        curr_child = child.text
                        index = item.text.index(curr_child)
                        text_holder[index] = curr_child
                    text_holder = [
                        text for text in text_holder if text != None]
                    if text_holder in sentence_dict.values():
                        continue
                    else:
                        sentence_dict[token.text] = text_holder
        second_list = sentence_split_list
        sentence_split_list = []
        if row['example-three_1'] != 'Empty':
            ds = ([], {}, nlp_j(row['example-three_1'].replace(' ', '')))
            sentence_split_list.append(ds)
        else:
            sentence_split_list.append(row['example-three_1'])

        for entry in sentence_split_list:
            if entry != 'Empty':
                result, sentence_dict, item = entry
                for token in item:
                    result.append(token.text)
                    text_holder = [None for i in range(len(item.text))]
                    current_word = token.text
                    if current_word in skip_structure:
                        continue
                    word_pos = item.text.index(current_word)
                    text_holder[word_pos] = current_word
                    get_ancestors = token.ancestors
                    for ancestor in get_ancestors:
                        curr_ancestor = ancestor.text
                        index = item.text.index(curr_ancestor)
                        text_holder[index] = curr_ancestor
                    give_children = token.children
                    for child in give_children:
                        curr_child = child.text
                        index = item.text.index(curr_child)
                        text_holder[index] = curr_child
                    text_holder = [
                        text for text in text_holder if text != None]
                    if text_holder in sentence_dict.values():
                        continue
                    else:
                        sentence_dict[token.text] = text_holder
        third_list = sentence_split_list
        print(first_list[0])
        combined_list = [first_list[0],
                         second_list[0],
                         third_list[0]]
        final_dict = {}
        for index, item in enumerate(combined_list):
            if item != 'Empty':
                final_dict[f'result{index}'] = json.dumps(item[0])
                final_dict[f'split{index}'] = json.dumps(item[1])
            else:
                final_dict[f'result{index}'] = json.dumps(item)
                final_dict[f'split{index}'] = json.dumps(item)
        japaneseWord = row['ja-word']
        englishWord = row['en-word']
        englishSentenceOne = row['example-one-en']
        englishSentenceTwo = row['example-two-en']
        englishSentenceThree = row['example-three-en']
        sentenceOne = final_dict['result0']
        sentenceOne_split = final_dict['split0']

        sentenceTwo = final_dict['result1']
        sentenceTwo_split = final_dict['split1']

        sentenceThree = final_dict['result2']
        sentenceThree_split = final_dict['split2']

        sentence = J6kSentences(
            japaneseWord=japaneseWord,
            englishWord=englishWord,
            sentenceOne=sentenceOne,
            englishSentenceOne=englishSentenceOne,
            sentenceTwo=sentenceTwo,
            englishSentenceTwo=englishSentenceTwo,
            sentenceThree=sentenceThree,
            englishSentenceThree=englishSentenceThree,
            sentenceNumber=progress
        )

        sentence.save()
        sentenceSplit = J6kSplit(
            sentence=sentence,
            sentenceOne_split=sentenceOne_split,

            sentenceTwo_split=sentenceTwo_split,

            sentenceThree_split=sentenceThree_split,
        )
        sentenceSplit.save()

        progress += 1
        print(f'{progress} Progress')
    print(sentence_dict)
    print(result)
    print('>>>>>>>>>>DONE<<<<<<<<<<<<')
    return JsonResponse({'message': 'success'}, status=200)


def KConvo():
    df = pd.read_csv(
        '/home/oneeyedodin/Desktop/Language-backup/K-Conversations/SortedConversations.csv')

    nlp_k = spacy.load('ko_core_news_lg')
    progress = 1

    for index, row in df.iterrows():
        doc_k_sen = nlp_k(row['kor_sent'])
        result = []
        sentence_dict = {}
        for token in doc_k_sen:
            result.append(token.text)
            text_holder = [None for i in range(len(doc_k_sen.text))]
            current_word = token.text
            if current_word in skip_structure:
                continue
            word_pos = doc_k_sen.text.index(current_word)
            text_holder[word_pos] = current_word
            get_ancestors = token.ancestors
            for ancestor in get_ancestors:
                curr_ancestor = ancestor.text
                index = doc_k_sen.text.index(curr_ancestor)
                text_holder[index] = curr_ancestor
            give_children = token.children
            for child in give_children:
                curr_child = child.text
                index = doc_k_sen.text.index(curr_child)
                text_holder[index] = curr_child
            text_holder = [text for text in text_holder if text != None]
            if text_holder in sentence_dict.values():
                continue
            else:
                sentence_dict[token.text] = text_holder
        ko_sentenceSplitJSON = json.dumps(sentence_dict)
        ko_jsonString = json.dumps(result)

        sentence = KSentences(

            lessonSentence=ko_jsonString,
            englishSentence=row['eng_sent'],
            sentenceNumber=progress)
        sentence.save()
        sentenceSplit = KSentenceSplit(
            sentence=sentence, sentenceSplit=ko_sentenceSplitJSON,
        )
        sentenceSplit.save()
        progress += 1
        print(f'{progress} Progress')
    print('>>>>>>>>>>DONE<<<<<<<<<<<<')
    return JsonResponse('Success', safe=False)


def KJE():
    df = pd.read_csv(
        '/home/oneeyedodin/Desktop/Language-backup/KJE/1000sents.csv')

    nlp_j = spacy.load("ja_core_news_lg")
    nlp_k = spacy.load('ko_core_news_lg')
    nlp_e = spacy.load("en_core_web_lg")
    nlp_j.add_pipe("language_detector")
    nlp_k.add_pipe("language_detector")
    nlp_e.add_pipe("language_detector")
    progress = 1
    word_df = df.drop_duplicates(subset=[
        'HEADWORD', 'ENGLISH', 'JAPANESE', 'EXAMPLE (KO)', 'EXAMPLE (EN)', 'EXAMPLE (JA)'])
    word_df = word_df[['HEADWORD', 'ENGLISH', 'JAPANESE',
                       'EXAMPLE (KO)', 'EXAMPLE (EN)', 'EXAMPLE (JA)']]
    word_df = word_df.dropna()
    for index, row in word_df.iterrows():
        doc_j_sen = nlp_j(row['EXAMPLE (JA)'])
        doc_k_sen = nlp_k(row['EXAMPLE (KO)'])

        result = []
        sentence_dict = {}
        for token in doc_k_sen:
            result.append(token.text)
            text_holder = [None for i in range(len(doc_k_sen.text))]
            current_word = token.text
            if current_word in skip_structure:
                continue
            word_pos = doc_k_sen.text.index(current_word)
            text_holder[word_pos] = current_word
            get_ancestors = token.ancestors
            for ancestor in get_ancestors:
                curr_ancestor = ancestor.text
                index = doc_k_sen.text.index(curr_ancestor)
                text_holder[index] = curr_ancestor
            give_children = token.children
            for child in give_children:
                curr_child = child.text
                index = doc_k_sen.text.index(curr_child)
                text_holder[index] = curr_child
            text_holder = [text for text in text_holder if text != None]
            if text_holder in sentence_dict.values():
                continue
            else:
                sentence_dict[token.text] = text_holder
        ko_sentenceSplitJSON = json.dumps(sentence_dict)
        ko_jsonString = json.dumps(result)
        result = []
        sentence_dict = {}
        for token in doc_j_sen:
            result.append(token.text)
            text_holder = [None for i in range(len(doc_j_sen.text))]
            current_word = token.text
            if current_word in skip_structure:
                continue
            word_pos = doc_j_sen.text.index(current_word)
            text_holder[word_pos] = current_word
            get_ancestors = token.ancestors
            for ancestor in get_ancestors:
                curr_ancestor = ancestor.text
                index = doc_j_sen.text.index(curr_ancestor)
                text_holder[index] = curr_ancestor
            give_children = token.children
            for child in give_children:
                curr_child = child.text
                index = doc_j_sen.text.index(curr_child)
                text_holder[index] = curr_child
            text_holder = [text for text in text_holder if text != None]
            if text_holder in sentence_dict.values():
                continue
            else:
                sentence_dict[token.text] = text_holder
        ja_sentenceSplitJSON = json.dumps(sentence_dict)
        ja_jsonString = json.dumps(result)
        sentence = KJESentences(
            koreanSentence=ko_jsonString,
            japaneseSentence=ja_jsonString,
            englishSentence=row['EXAMPLE (EN)'],
            koreanWord=row['HEADWORD'].replace(' ', ''),
            japaneseWord=row['JAPANESE'].replace(' ', ''),
            sentenceNumber=progress,
            englishWord=row['ENGLISH']
        )
        sentence.save()
        sentenceSplit = KJESentenceSplit(
            sentence=sentence, koreanSentence=ko_sentenceSplitJSON,
            japaneseSentence=ja_sentenceSplitJSON)
        sentenceSplit.save()
        progress += 1
        print(f'{progress} Progress')
    print('>>>>>>>>>>DONE<<<<<<<<<<<<')
    return JsonResponse('Success', safe=False)


@ csrf_exempt
@ api_view(('GET',))
@ renderer_classes((TemplateHTMLRenderer, JSONRenderer))
def getAlphabet(_, writingSystem):
    print(_, writingSystem)
    alphabet = Alphabet.objects.all().values(writingSystem)[0][writingSystem]

    parsedAlphabet = json.loads(alphabet)

    letterRomaPairs = []

    for letter, pronunciation in parsedAlphabet.items():
        letterRomaPairs.append(
            {'letter': letter, 'pronunciation': pronunciation})
    response = Response()

    response.data = {
        'alphabet': letterRomaPairs,
    }
    return JsonResponse(response.data)


LESSON_SENTENCES = {
    'japanese-conversations': [JSentences, JSentenceSplit],
    'korean-conversations': [KSentences, KSentenceSplit],
    'kje': [KJESentences, KJESentenceSplit],
    'j6k': [J6kSentences, J6kSplit],
}


@ csrf_exempt
@ api_view(('GET',))
@ renderer_classes((TemplateHTMLRenderer, JSONRenderer))
def getLesson(request, topic, pageNumber):

    modelReference = LESSON_SENTENCES[topic][0]
    splitReference = LESSON_SENTENCES[topic][1]

    modelCount = modelReference.objects.all().count()
    if modelCount < int(pageNumber):
        raise exceptions.NotFound('Requested page out of bounds.')

    dbModel = modelReference.objects.get(
        sentenceNumber=pageNumber)
    dbSplitModel = splitReference.objects.filter(sentence=dbModel).first()

    response = Response()

    match topic:
        case 'japanese-conversations':
            response.data = japaneseConversations(
                dbModel, dbSplitModel)
        case 'korean-conversations':
            response.data = koreanConversations(
                dbModel, dbSplitModel)
        case 'kje':
            response.data = getKJE(dbModel, dbSplitModel)
            response.data['sentenceCount'] = 2
        case 'j6k':
            response.data = getJ6k(dbModel, dbSplitModel)
        case _:
            raise exceptions.NotAcceptable('Invalid topic.')
    response.data['pageNumber'] = pageNumber
    print(pageNumber)
    response.data['totalPages'] = modelCount
    return response


def getKJE(dbModel, dbSplitModel):

    jBundle = bundleSentence(
        dbModel.japaneseSentence, dbSplitModel.japaneseSentence, 'japanese')
    jBundle['word'] = dbModel.japaneseWord

    kBundle = bundleSentence(dbModel.koreanSentence,
                             dbSplitModel.koreanSentence, 'korean')
    kBundle['word'] = dbModel.koreanWord

    eBundle = englishBundle(dbModel)
    eBundle['word'] = dbModel.englishWord

    return {'japanese': jBundle, 'korean': kBundle, 'english': eBundle}


def japaneseConversations(dbModel, dbSplitModel):
    jBundle = bundleSentence(
        dbModel.lessonSentence, dbSplitModel.sentenceSplit, 'japanese')

    eBundle = englishBundle(dbModel)

    return {'japanese': jBundle, 'english': eBundle}


def koreanConversations(dbModel, dbSplitModel):
    kBundle = bundleSentence(
        dbModel.lessonSentence, dbSplitModel.sentenceSplit, 'korean')

    eBundle = englishBundle(dbModel)

    return {'korean': kBundle, 'english': eBundle}


def getJ6k(dbModel, dbSplitModel):
    jOneBundle = bundleSentence(
        dbModel.sentenceOne, dbSplitModel.sentenceOne_split, 'japanese')
    eOneBundle = dbModel.englishSentenceOne

    jTwoBundle = bundleSentence(
        dbModel.sentenceTwo, dbSplitModel.sentenceTwo_split, 'japanese')
    eTwoBundle = dbModel.englishSentenceTwo

    jThreeBundle = bundleSentence(
        dbModel.sentenceThree, dbSplitModel.sentenceThree_split, 'japanese')
    eThreeBundle = dbModel.englishSentenceThree

    j6kBundle = {}

    if jOneBundle:
        j6kBundle['jOneBundle'] = jOneBundle
        j6kBundle['eOneBundle'] = eOneBundle
    if jTwoBundle:
        j6kBundle['jTwoBundle'] = jTwoBundle
        j6kBundle['eTwoBundle'] = eTwoBundle
    if jThreeBundle:
        j6kBundle['jThreeBundle'] = jThreeBundle
        j6kBundle['eThreeBundle'] = eThreeBundle

    j6kBundle['words'] = [dbModel.japaneseWord, dbModel.englishWord]
    return j6kBundle


def bundleSentence(dbModel, dbSplitModel, language):

    parsedDbModel = json.loads(dbModel)
    parsedSplitModel = json.loads(dbSplitModel)
    if parsedSplitModel == 'Empty':
        return None

    altSpelling = bundleAlt(parsedDbModel, language)

    uuidList = [uuid.uuid4() for _ in range(len(parsedDbModel))]

    reqBundle = {
        'sentence': parsedDbModel,
        'split': parsedSplitModel,
        'altSpelling': altSpelling,
        'uuidList': uuidList,
        'language': language,

    }
    return reqBundle


def bundleAlt(parsedDbModel, language):

    match language:
        case 'japanese':
            return getKanaHiraRoma(parsedDbModel)
        case 'korean':
            return getKoreanRoma(parsedDbModel)
        case _:
            raise exceptions.ParseError('Invalid Language')


def englishBundle(dbModel):
    return {
        'sentence': dbModel.englishSentence,

    }


def getKanaHiraRoma(sentence):

    if sentence == 'Empty':
        return sentence, sentence, sentence
    kks = pykakasi.kakasi()

    alternatives = {
        'katakana': [],
        'hiragana': [],
        'romanized': []
    }
    for item in sentence:
        result = kks.convert(item)
        alternatives['katakana'].append(result[0]['kana'])
        alternatives['hiragana'].append(result[0]['hira'])
        alternatives['romanized'].append(result[0]['hepburn'])
    return alternatives


def getKoreanRoma(sentence):
    romanizedKorean = []
    for word in sentence:
        romanizerInit = Romanizer(word)
        romanized = romanizerInit.romanize()
        romanizedKorean.append(romanized)
    return romanizedKorean


def getWSystem(request):
    try:
        data = json.loads(request.body.decode('utf-8'))
        wSystem = data['wSystem']
        return wSystem
    except:
        return False


@ csrf_exempt
@ api_view(('POST',))
@ renderer_classes((TemplateHTMLRenderer, JSONRenderer))
def translate(request):

    sentence, language = getArguments(request)
    if language == 10:
        translated = GoogleTranslator(
            source='ja', target='en').translate(sentence)
    elif language == 11:
        translated = GoogleTranslator(
            source='ko', target='en').translate(sentence)

    response = Response()
    response.data = {
        'translation': translated
    }
    return response


def getArguments(request):
    try:
        data = json.loads(request.body.decode('utf-8'))
        sentence = data['sentence']
        language = data['language']
        return sentence, language
    except:
        return False, False
