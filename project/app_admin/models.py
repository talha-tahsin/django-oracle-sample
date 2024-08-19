from django.db import models
from django.db.models import CharField


# Create your models here.


class CategoryType(models.Model):
    id = models.AutoField('row_id', primary_key=True)
    category_id = models.CharField('Category id', max_length=50)
    category_name = models.CharField('Category Name', max_length=50, null=True, blank=True)
    created_by = models.CharField(max_length=20, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)

    def __str__(self) -> CharField:
        return self.category_id

    class Meta:
        verbose_name_plural = "Category Type"
        db_table = 'tbl_category_type'
        ordering = ['category_name']
