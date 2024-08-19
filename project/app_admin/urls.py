from django.urls import path
from . import views

urlpatterns = [

    # app_admin views ::
    path('dashboard/', views.showDashboardPage, name="admin_dashboard"),

    path('category-type', views.showCategoryType, name="category_type"),
    path('division', views.getCategoryName, name="test"),
    path('store-category-type/', views.storeCategoryType, name="store_category_type"),

    # # admin views :: [map legend]
    # path('admin-map-legend', views.adminMapLegend, name="admin_map_legend"),
    # path('get-map-legend-list/', views.getMapLegendList, name='map_legend_list'),
    # path('get-all-categoryId/', views.getAllCategoryId, name='get_all_categoryId'),
    # path('save-new-map-legend/', views.saveNewMapLegend, name='new_map_legend'),
    # path('show-map-legend-details-for-edit/', views.showMapLegendDetails, name='map_legend_edit'),
    # path('save-map-legend-changes/', views.saveMapLegendChanges, name='map_legend_save_changes'),
    # path('delete-map-legend-info/', views.deleteMapLegend, name='delete_map_legend'),
    #
    # # admin views :: [add layer map color]
    # path('admin-add-layer-map-color', views.showLayerMapColor, name="add_layer_map_color"),
    # path('save-new-layer-map-color/', views.saveNewLayerMapColor, name="save_new_layer_map_color"),
    #
    # # admin views :: [view layer map color]
    # path('admin-view-layer-map-color', views.viewLayerMapColor, name="view_layer_map_color"),
    # path('get-layer-map-color-list/', views.getLayerMapColorList, name='layer_map_color_list'),
    # path('show-layer-map-color-details/', views.showLayerMapColorDetails, name='show_layer_map_color_details'),
    # path('save-layer-map-color-changes/', views.saveLayerMapColorChanges, name='save_layer_map_color_changes'),
    # path('delete-layer-map-color-info/', views.deleteLayerMapColor, name='delete_layer_map_color'),
    # path('get-category-wise-legend-values/', views.cateWiseLegendValues, name='cate_wise_legend_values'),
    # path('get-legend-value-wise-color/', views.legendValueWiseColor, name='legend_value_wise_color'),
    # path('get-watershed-list/', views.getWatershedList, name='get_watershed_list'),
    # path('get-watershed-para-list/', views.getWatershedParaList, name='get_watershed_para_list'),

]
