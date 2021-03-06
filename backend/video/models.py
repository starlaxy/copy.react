from django.db import models
from django.utils import timezone
from project.models import Project
from config import settings
from django.dispatch import receiver
from django.db.models.signals import post_save, pre_save

import os
import json

def get_upload_to(instance, filename):
    root, ext = os.path.splitext(filename)
    return '{0}/{1}/{2}{3}'.format(instance.video_relation.project.pk, instance.video_relation.pk, instance.pk, ext)

class VideoRelation(models.Model):
    title = models.CharField(max_length=100)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)

    def __str__(self):
        return self.title

    class Meta:
        db_table = 'VideoRelation'

class Video(models.Model):
    video_relation = models.ForeignKey(VideoRelation, on_delete=models.CASCADE)
    video = models.FileField(upload_to=get_upload_to, null=True)
    three_dimensional_flg = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = 'Video'

_UNSAVED_FILEFIELD = 'unsaved_filefield'

@receiver(pre_save, sender=Video)
def skip_saving_file(sender, instance, **kwargs):
    if not instance.pk and not hasattr(instance, _UNSAVED_FILEFIELD):
        setattr(instance, _UNSAVED_FILEFIELD, instance.video)
        instance.video = None

@receiver(post_save, sender=Video)
def save_file(sender, instance, created, **kwargs):
    if created and hasattr(instance, _UNSAVED_FILEFIELD):
        instance.video = getattr(instance, _UNSAVED_FILEFIELD)
        instance.save()
        instance.__dict__.pop(_UNSAVED_FILEFIELD)

def get_popup_upload_to(instance, filename):
    root, ext = os.path.splitext(filename)
    return '{0}/{1}/{2}/{3}'.format(instance.video.video_relation.project.pk, instance.video.video_relation.pk, 'popupImg', filename)

class Tag(models.Model):
    video = models.ForeignKey(Video, on_delete=models.CASCADE)
    title = models.CharField(max_length=20)
    action_type = models.CharField(max_length=20)
    url = models.CharField(max_length=100, default='', blank=True, null=True)
    story_next_video = models.ForeignKey(VideoRelation, default='', on_delete=models.CASCADE, related_name='story_next_video', blank=True, null=True)
    story_start_frame = models.IntegerField(default=0, null=True, blank=True)
    popup_type = models.CharField(max_length=20, default='', blank=True, null=True)
    popup_img = models.FileField(upload_to=get_popup_upload_to, null=True, blank=True)
    popup_text = models.CharField(max_length=100, default='', blank=True, null=True)
    popup_btn_text = models.CharField(max_length=20, default='', blank=True, null=True)
    popup_btn_url = models.URLField(max_length=100, default='', blank=True, null=True)
    left = models.DecimalField(blank=False, null=False, decimal_places=2, max_digits=8, default=0)
    top = models.DecimalField(blank=False, null=False, decimal_places=2, max_digits=8, default=0)
    width = models.DecimalField(blank=False, null=False, decimal_places=2, max_digits=5)
    height = models.DecimalField(blank=False, null=False, decimal_places=2, max_digits=5)
    display_frame = models.IntegerField(blank=False, null=False)
    hide_frame = models.IntegerField(blank=False, null=False)
    created_at = models.DateTimeField(default=timezone.now)

    def filename(self):
        return os.path.basename(self.file.name)

    def __str__(self):
        return self.title

    class Meta:
        db_table = 'Tag'

class EndTag(models.Model):
    video = models.ForeignKey(Video, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    content = models.CharField(max_length=100)

    def __str__(self):
        return self.title

    class Meta:
        db_table = 'EndTag'
