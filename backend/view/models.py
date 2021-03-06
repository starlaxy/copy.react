from django.db import models
from django.utils import timezone
from video.models import Tag, Video, VideoRelation


class UserAnalysis(models.Model):
    user_agent = models.CharField(max_length=200)
    video_relation = models.ForeignKey(VideoRelation, on_delete=models.SET_NULL, null=True)
    user_cookie = models.CharField(max_length=100)
    access_time = models.DateTimeField(default=timezone.now)
    leave_time = models.DateTimeField(null=True, blank=True)
    start_time = models.DateTimeField(null=True, blank=True)
    end_time = models.TimeField(null=True, blank=True)

    def __str__(self):
        return str(self.access_time)

    class Meta:
        db_table = 'UserAnalysis'

class ActionAnalysis(models.Model):
    user_analysis = models.ForeignKey(UserAnalysis, on_delete=models.SET_NULL, null=True)
    tag = models.ForeignKey(Tag, on_delete=models.SET_NULL, null=True, blank=True)
    action_type = models.CharField(max_length=10)
    action_time = models.TimeField(null=True, blank=True)
    switch_video = models.ForeignKey(Video, on_delete=models.SET_NULL, null=True, blank=True)
    story_end_time = models.TimeField(null=True, blank=True)
    popup_btn_flg = models.BooleanField(default=False)

    def __str__(self):
        return str(self.action_type)

    class Meta:
        db_table = 'ActionAnalysis'
