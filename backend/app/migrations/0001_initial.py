# Generated by Django 3.2.25 on 2024-11-02 19:50

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Detection',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('logic', models.TextField()),
                ('description', models.TextField()),
                ('shannon_score', models.FloatField(blank=True, null=True)),
                ('tac', models.FloatField(blank=True, null=True)),
                ('di', models.FloatField(blank=True, null=True)),
                ('oc', models.FloatField(blank=True, null=True)),
                ('irp', models.FloatField(blank=True, null=True)),
                ('u', models.FloatField(blank=True, null=True)),
                ('mitre_tactics', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=255), blank=True, default=list, size=None)),
                ('mitre_techniques', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=255), blank=True, default=list, size=None)),
            ],
        ),
        migrations.CreateModel(
            name='ShannonScoreWeights',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tac_weight', models.FloatField(default=1.0)),
                ('di_weight', models.FloatField(default=1.0)),
                ('oc_weight', models.FloatField(default=1.0)),
                ('irp_weight', models.FloatField(default=1.0)),
                ('u_weight', models.FloatField(default=1.0)),
            ],
            options={
                'verbose_name_plural': 'Shannon Score Weights',
            },
        ),
    ]
