from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.core.exceptions import ValidationError

class Detection(models.Model):
    name = models.CharField(max_length=255)
    logic = models.TextField()
    description = models.TextField()
    shannon_score = models.FloatField(null=True, blank=True)
    
    # Components of S3
    tac = models.FloatField(null=True, blank=True)   # Threat Alignment & Coverage
    di = models.FloatField(null=True, blank=True)    # Detection Integrity
    oc = models.FloatField(null=True, blank=True)    # Operational Cost
    irp = models.FloatField(null=True, blank=True)   # Impact & Risk Potential
    u = models.FloatField(null=True, blank=True)     # Utility

    # Fields for MITRE ATT&CK mappings
    mitre_tactics = ArrayField(
        models.CharField(max_length=255),
        default=list,
        blank=True,
    )
    mitre_techniques = ArrayField(
        models.CharField(max_length=255),
        default=list,
        blank=True,
    )

    def __str__(self):
        return self.name


class ShannonScoreWeights(models.Model):
    tac_weight = models.FloatField(default=0.2)
    di_weight = models.FloatField(default=0.2)
    oc_weight = models.FloatField(default=0.2)
    irp_weight = models.FloatField(default=0.2)
    u_weight = models.FloatField(default=0.2)

    class Meta:
        verbose_name_plural = "Shannon Score Weights"

    def __str__(self):
        return "Shannon Score Weights"

    def save(self, *args, **kwargs):
        """
        Override the save method to ensure only one instance of ShannonScoreWeights exists.
        """
        if not self.pk and ShannonScoreWeights.objects.exists():
            raise ValidationError('There can be only one ShannonScoreWeights instance')
        super(ShannonScoreWeights, self).save(*args, **kwargs)