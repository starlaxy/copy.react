# Generated by Django 3.1.7 on 2021-04-28 03:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('video', '0004_auto_20210409_1944'),
    ]

    operations = [
        migrations.AlterField(
            model_name='tag',
            name='popup_btn_text',
            field=models.CharField(blank=True, default='', max_length=20, null=True),
        ),
    ]
