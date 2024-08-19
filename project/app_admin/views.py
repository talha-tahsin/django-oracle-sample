from django.http import HttpResponse
from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.db import connection
import xmltodict

from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.shortcuts import get_object_or_404
import json

from app_admin.models import CategoryType


# Create your views here.
def showDashboardPage(request):
    return render(request, 'pages/dashboard.html')

def showCategoryType(request):
    return render(request, 'pages/categoryType.html')

def getCategoryName(request):
    try:
        ret_data = CategoryType.objects.order_by('id')
        json_data = [{
            'cat_id': obj.category_id,
            'cat_name': obj.category_name,
        } for obj in ret_data]
        print(json_data)
        return JsonResponse({'status': True, 'response': json_data})
    except Exception as e:
        return JsonResponse({'status': False, 'error': str(e)})

@csrf_exempt
@require_POST
def storeCategoryType(request):
    if request.method == 'POST':
        body_unicode = request.body.decode('utf-8')
        data = json.loads(body_unicode)
        p_data = data.get('cate_id'), data.get('cate_name')
        print(p_data)

        if not p_data:
            return JsonResponse({'message': 'Missing parameter'}, status=400)

        try:
            with connection.cursor() as cursor:
                xml_ret = cursor.callfunc('PKG_TEST.store_category_info', str, [json.dumps(data)])
            # Convert XML to JSON using xmltodict
            data = xmltodict.parse(xml_ret)

            return JsonResponse({'jsonObj': data})
        except json.JSONDecodeError:
            return JsonResponse({'message': 'Invalid JSON'}, status=400)
        except Exception as e:
            return JsonResponse({'message': str(e)}, status=500)



#
# # Basic or Common Functions ::
# def getAllCategoryId(request):
#     if request.method == 'GET':
#         try:
#             ret_data = CategoryType.objects.order_by('category_name')
#             json_data = [{
#                 'row_id': obj.id,
#                 'cate_id': obj.category_id,
#                 'cate_name': obj.category_name,
#             } for obj in ret_data]
#             return JsonResponse({'status': True, 'response': json_data})
#         except Exception as e:
#             return JsonResponse({'status': False, 'error': str(e)})
#     else:
#         return JsonResponse({'status': False, 'error': 'Invalid request method'})
#
#
# def getWatershedList(request):
#     if request.method == 'GET':
#         try:
#             ret_data = Watershed.objects.order_by('watershed_name')
#             json_data = [{
#                 'watershed_id': obj.watershed_code,
#                 'watershed_name': obj.watershed_name,
#             } for obj in ret_data]
#             return JsonResponse({'status': True, 'response': json_data})
#         except Exception as e:
#             return JsonResponse({'status': False, 'error': str(e)})
#     else:
#         return JsonResponse({'status': False, 'error': 'Invalid request method'})
#
#
# def getWatershedParaList(request):
#     if request.method == 'POST':
#         p_watershed_id = request.POST.get('dataToSend')
#         try:
#             ret_data = WatershedParaList.objects.filter(watershed_id=p_watershed_id).order_by('para_name')
#             json_data = [{
#                 'watershed_id': obj.watershed_id,
#                 'para_name': obj.para_name,
#             } for obj in ret_data]
#             return JsonResponse({'status': True, 'response': json_data})
#         except Exception as e:
#             return JsonResponse({'status': False, 'error': str(e)})
#     else:
#         return JsonResponse({'status': False, 'error': 'Invalid request method'})
#
#
# # Map Legend-Related Functions ::
#
# @csrf_exempt
# def saveNewMapLegend(request):
#     if request.method == 'POST':
#         try:
#             data = json.loads(request.POST.get('dataToSend'))
#             p_cate_id = data.get('cate_id')
#             p_cate_name = data.get('cate_name')
#             p_header = data.get('header')
#             p_color = data.get('color')
#             p_value = data.get('value')
#
#             new_legend = MapLegend(
#                 category_id=p_cate_id,
#                 category_name=p_cate_name,
#                 display_header=p_header,
#                 legend_color=p_color,
#                 legend_value=p_value
#             )
#             new_legend.save()
#
#             return JsonResponse({'status': True, 'message': 'New record add successfully...'})
#         except MapLegend.DoesNotExist:
#             return JsonResponse({'status': False, 'message': 'Legend not found.'})
#         except Exception as e:
#             return JsonResponse({'status': False, 'message': str(e)})
#     else:
#         return JsonResponse({'status': False, 'message': 'Invalid request method.'})
#
#
# def getMapLegendList(request):
#     if request.method == 'GET':
#         try:
#             ret_data = MapLegend.objects.order_by('id')
#             json_data = [{
#                 'row_id': obj.id,
#                 'cate_name': obj.category_name,
#                 'header': obj.display_header,
#                 'color': obj.legend_color,
#                 'value': obj.legend_value
#             } for obj in ret_data]
#             return JsonResponse({'status': True, 'response': json_data})
#         except Exception as e:
#             return JsonResponse({'status': False, 'error': str(e)})
#     else:
#         return JsonResponse({'status': False, 'error': 'Invalid request method'})
#
#
# def showMapLegendDetails(request):
#     if request.method == 'POST':
#         row_id = request.POST.get('dataToSend')
#         print(f"Received Id: {row_id}")
#         try:
#             ret_data = MapLegend.objects.filter(id=row_id)
#             json_data = [{
#                 'row_id': obj.id,
#                 'cate_name': obj.category_name,
#                 'header': obj.display_header,
#                 'color': obj.legend_color,
#                 'value': obj.legend_value
#             } for obj in ret_data]
#             return JsonResponse({'status': True, 'response': json_data})
#         except Exception as e:
#             return JsonResponse({'status': False, 'error': str(e)})
#     else:
#         return JsonResponse({'status': False, 'error': 'Invalid request method'})
#
#
# @csrf_exempt
# def saveMapLegendChanges(request):
#     if request.method == 'POST':
#         try:
#             data = json.loads(request.POST.get('dataToSend'))
#             p_row_id = data.get('row_id')
#             p_cat_name = data.get('cat_name')
#             p_header = data.get('header')
#             p_coclor = data.get('color')
#             p_value = data.get('value')
#
#             legend = MapLegend.objects.get(id=p_row_id)
#             legend.category_name = p_cat_name
#             legend.display_header = p_header
#             legend.legend_color = p_coclor
#             legend.legend_value = p_value
#             legend.save()
#
#             return JsonResponse({'status': True, 'message': 'Changes saved successfully...'})
#         except MapLegend.DoesNotExist:
#             return JsonResponse({'status': False, 'message': 'Legend not found.'})
#         except Exception as e:
#             return JsonResponse({'status': False, 'message': str(e)})
#     else:
#         return JsonResponse({'status': False, 'message': 'Invalid request method.'})
#
#
# @csrf_exempt
# def deleteMapLegend(request):
#     if request.method == 'POST':
#         row_id = request.POST.get('dataToSend')
#         if row_id:
#             try:
#                 data = get_object_or_404(MapLegend, id=row_id)
#                 data.delete()
#                 return JsonResponse({'status': True, 'message': 'Data deleted successfully!'})
#             except MapLegend.DoesNotExist:
#                 return JsonResponse({'status': False, 'message': 'Map Legend not found!'})
#         else:
#             return JsonResponse({'status': False, 'message': 'Invalid ID provided!'})
#     else:
#         return JsonResponse({'status': False, 'message': 'Invalid request method!'})
#
#
# # Layer Map Color-Related Functions ::
# @csrf_exempt
# def saveNewLayerMapColor(request):
#     if request.method == 'POST':
#         try:
#             data = json.loads(request.POST.get('dataToSend'))
#             p_cate_id = data.get('cate_id')
#             p_cate_name = data.get('cate_name')
#             p_watershed = data.get('watershed')
#             p_para_name = data.get('para_name')
#             p_act_value = data.get('act_value')
#             p_legend_value = data.get('legend_value')
#             p_layer_color = data.get('layer_color')
#
#             data = LayerMapColor(
#                 category_id=p_cate_id,
#                 category_name=p_cate_name,
#                 watershed_id=p_watershed,
#                 para_name=p_para_name,
#                 actual_value=p_act_value,
#                 legend_value=p_legend_value,
#                 layer_color=p_layer_color,
#             )
#             data.save()
#
#             return JsonResponse({'status': True, 'message': 'New data saved successfully...'})
#         except LayerMapColor.DoesNotExist:
#             return JsonResponse({'status': False, 'message': 'Legend not found.'})
#         except Exception as e:
#             return JsonResponse({'status': False, 'message': str(e)})
#     else:
#         return JsonResponse({'status': False, 'message': 'Invalid request method.'})
#
#
# def getLayerMapColorList(request):
#     if request.method == 'GET':
#         try:
#             ret_data = LayerMapColor.objects.order_by('id')
#             json_data = [{
#                 'row_id': obj.id,
#                 'cate_name': obj.category_name,
#                 'watershed': obj.watershed_id,
#                 'para_name': obj.para_name,
#                 'act_value': obj.actual_value,
#                 'legnd_value': obj.legend_value,
#                 'color': obj.layer_color,
#             } for obj in ret_data]
#             return JsonResponse({'status': True, 'response': json_data})
#         except Exception as e:
#             return JsonResponse({'status': False, 'error': str(e)})
#     else:
#         return JsonResponse({'status': False, 'error': 'Invalid request method'})
#
#
# def showLayerMapColorDetails(request):
#     if request.method == 'POST':
#         row_id = request.POST.get('dataToSend')
#         print(f"Received Id: {row_id}")
#         try:
#             ret_data = LayerMapColor.objects.filter(id=row_id)
#             json_data = [{
#                 'row_id': obj.id,
#                 'cate_name': obj.category_name,
#                 'watershed': obj.watershed_id,
#                 'para_name': obj.para_name,
#                 'act_value': obj.actual_value,
#                 'legend_value': obj.legend_value,
#                 'color': obj.layer_color,
#             } for obj in ret_data]
#             return JsonResponse({'status': True, 'response': json_data})
#         except Exception as e:
#             return JsonResponse({'status': False, 'error': str(e)})
#     else:
#         return JsonResponse({'status': False, 'error': 'Invalid request method'})
#
#
# @csrf_exempt
# def saveLayerMapColorChanges(request):
#     if request.method == 'POST':
#         try:
#             data = json.loads(request.POST.get('dataToSend'))
#             p_row_id = data.get('row_id')
#             r_cat_name = data.get('p_cat_name')
#             r_watershed = data.get('p_watershed')
#             r_para_name = data.get('p_para_name')
#             r_act_val = data.get('P_act_value')
#             r_legend_val = data.get('p_legend_value')
#             r_color = data.get('p_color')
#
#             data = LayerMapColor.objects.get(id=p_row_id)
#             data.para_name = r_para_name
#             data.actual_value = r_act_val
#             data.legend_value = r_legend_val
#             data.layer_color = r_color
#             data.save()
#
#             return JsonResponse({'status': True, 'message': 'Changes saved successfully...'})
#         except LayerMapColor.DoesNotExist:
#             return JsonResponse({'status': False, 'message': 'Layer Map Color Model not found.'})
#         except Exception as e:
#             return JsonResponse({'status': False, 'message': str(e)})
#     else:
#         return JsonResponse({'status': False, 'message': 'Invalid request method.'})
#
#
# @csrf_exempt
# def deleteLayerMapColor(request):
#     if request.method == 'POST':
#         row_id = request.POST.get('dataToSend')
#         if row_id:
#             try:
#                 data = get_object_or_404(LayerMapColor, id=row_id)
#                 data.delete()
#                 return JsonResponse({'status': True, 'message': 'Data deleted successfully!'})
#             except LayerMapColor.DoesNotExist:
#                 return JsonResponse({'status': False, 'message': 'LayerMapColor Model not found!'})
#         else:
#             return JsonResponse({'status': False, 'message': 'Invalid ID provided!'})
#     else:
#         return JsonResponse({'status': False, 'message': 'Invalid request method!'})
#
#
# def cateWiseLegendValues(request):
#     if request.method == 'POST':
#         p_ctrgy = request.POST.get('dataToSend')
#         try:
#             ret_data = MapLegend.objects.filter(category_name=p_ctrgy).order_by('sorting')
#             json_data = [{
#                 'row_id': obj.id,
#                 'legend_val': obj.legend_value,
#             } for obj in ret_data]
#             return JsonResponse({'status': True, 'response': json_data})
#         except Exception as e:
#             return JsonResponse({'status': False, 'error': str(e)})
#     else:
#         return JsonResponse({'status': False, 'error': 'Invalid request method'})
#
#
# def legendValueWiseColor(request):
#     if request.method == 'POST':
#         p_rowId = request.POST.get('dataToSend')
#         try:
#             ret_data = MapLegend.objects.filter(id=p_rowId)
#             json_data = [{
#                 'row_id': obj.id,
#                 'legend_color': obj.legend_color,
#             } for obj in ret_data]
#             return JsonResponse({'status': True, 'response': json_data})
#         except Exception as e:
#             return JsonResponse({'status': False, 'error': str(e)})
#     else:
#         return JsonResponse({'status': False, 'error': 'Invalid request method'})
#
#
# def getDivisionName(request):
#     try:
#         ret_data = StudentInfo.objects.order_by('student_id')
#         json_data = [{
#             'stu_code': obj.student_id,
#             'stu_name': obj.student_name,
#         } for obj in ret_data]
#         # print(json_data)
#         return JsonResponse({'status': True, 'response': json_data})
#     except Exception as e:
#         return JsonResponse({'status': False, 'error': str(e)})
