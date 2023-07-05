# Generated by Django 4.2.1 on 2023-07-03 03:56

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('process', '0002_processchain_state'),
    ]

    operations = [
        migrations.CreateModel(
            name='Pipeline',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=200)),
                ('path', models.CharField(max_length=200)),
                ('user_name', models.CharField(max_length=200)),
                ('user_id', models.CharField(max_length=200)),
                ('parquet_path', models.CharField(max_length=200)),
            ],
        ),
        migrations.RemoveField(
            model_name='processchain',
            name='path',
        ),
    ]
