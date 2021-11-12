sap.ui.define([
	"sap/ui/core/mvc/Controller",
    'sap/ui/core/Fragment',
    'sap/ui/model/json/JSONModel',
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
    "sap/ui/Device",
    "sap/ui/core/ValueState"
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
	function (Controller, Fragment, JSONModel, Filter, FilterOperator, Sorter, Device, ValueState) {
		"use strict";

		return Controller.extend("sgddmusers.controller.View1", {
			onInit: function () {

                var that = this;

                that.columnlist_nav = true
                document.title = that.get_i18n("tab_title");

                // Cargas de dialogs generalizados 
                that.oLoader_app = new sap.m.BusyDialog({
                    showCancelButton: false,
                    title: that.get_i18n("dialog_cargando")
                });
                that.oLoader_detalle = new sap.m.BusyDialog({
                    showCancelButton: false,
                    title: that.get_i18n("dialog_title_cargando_detalle")
                });
                that.oLoader_datos = new sap.m.BusyDialog({
                    showCancelButton: false,
                    title: that.get_i18n("dialog_cargando_datos")
                });
                that.oLoader_requesting_data = new sap.m.BusyDialog({
                    showCancelButton: false,
                    title: that.get_i18n("dialog_title_cargando_detalle"),
                    text: that.get_i18n("dialog_esperar")
                });
                that.oLoader_creando = new sap.m.BusyDialog({
                    showCancelButton: false,
                    title: that.get_i18n("dialog_title_creando"),
                    text: that.get_i18n("dialog_esperar")
                });
                that.oLoader_actualizando = new sap.m.BusyDialog({
                    showCancelButton: false,
                    title: that.get_i18n("dialog_title_actualizando"),
                    text: that.get_i18n("dialog_esperar")
                });
                that.oLoader_eliminando = new sap.m.BusyDialog({
                    showCancelButton: false,
                    title: that.get_i18n("dialog_title_eliminando"),
                    text: that.get_i18n("dialog_esperar")
                });
                that.oLoader_aprobando = new sap.m.BusyDialog({
                    showCancelButton: false,
                    title: that.get_i18n("dialog_title_aprobando"),
                    text: that.get_i18n("dialog_esperar")
                });
                that.oLoader_rechazando = new sap.m.BusyDialog({
                    showCancelButton: false,
                    title: that.get_i18n("dialog_title_rechazando"),
                    text: that.get_i18n("dialog_esperar")
                });
                that.oLoader_validando = new sap.m.BusyDialog({
                    showCancelButton: false,
                    title: that.get_i18n("dialog_title_validando"),
                    text: that.get_i18n("dialog_esperar")
                });

                // Cargar modelo inicial de datos
                that.loadModel();
                that.oModelEdit = new JSONModel({
                    busy: false,
                    delay: 0
                });

                //Obtener usuario launchpad
                that.getUserInfo().then(() => {
                    //resolve
                });

                //Array de fragmentos en detalle (SHOW-EDIT)
                this._formFragments = {};


            },
            // ###################################################################################
            // ############################# ON INIT FUNCTIONS ###################################
            // Cargar Modelo Inicial Parametros Categoria.
            loadModel: async function () {
                let that = this;
                // Cargar oData Inicial
                var URL = 'sgdd/maintainer/readUser';
                var oData = {
                    "ID": ""
                };

                let oModel = new JSONModel([]);
                let records = 0;
                let oData_ = { records }
                let modelRecords = new JSONModel(oData_);
                that.getOwnerComponent().setModel(oModel, "modelUsers");
                that.getOwnerComponent().setModel(modelRecords, 'modelRecord');
                //Dialogo Cargar + Accion POST
                that.oLoader_datos.open()
                let response = await that.requestCAP(URL, oData, 'POST');
                that.oLoader_datos.close()
                if (response.EX_RESULT == 'S') {
                    oModel = new JSONModel(response.EX_DATA);
                    records = oModel.getData().length;
                    oData_ = { records };
                    modelRecords = new JSONModel(oData_);
                    that.getOwnerComponent().setModel(oModel, "modelUsers");
                    that.getOwnerComponent().setModel(modelRecords, "modelRecord");

                } else if (response.EX_RESULT = 'E') {
                    that._buildDialog(that.get_i18n("dialog_error"), "Error", that.get_i18n(response.EX_MESSAGE)).open();
                } else {
                    that._buildDialog(that.get_i18n("dialog_error"), "Error", that.get_i18n("dialog_msg_8") + ' ' + URL
                        + '.\n' + that.get_i18n("dialog_msg_8_1")).open();
                }
            },

            loadPuntoEmision: async function (oID) {
                let that = this;
                // Cargar oData Inicial
                var URL = 'sgdd/maintainer/getUserEmissionPointByUser';
                var id = oID
                var oData = {
                    user_ID:id
                };

                let oModel = new JSONModel([]);
                let records = 0;
                let oData_ = { records }
                let modelRecords = new JSONModel(oData_);
                that.getOwnerComponent().setModel(oModel, "modelPuntoEmision_");
                that.getOwnerComponent().setModel(modelRecords, 'modelRecord_');
                //Dialogo Cargar + Accion POST
                that.oLoader_datos.open()
                let response = await that.requestCAP(URL, oData, 'POST');
                if (response.EX_RESULT == 'S') {
                    oModel = new JSONModel(response.EX_DATA);
                    records = oModel.getData().length;
                    oData_ = { records };
                    modelRecords = new JSONModel(oData_);
                    that.getOwnerComponent().setModel(oModel, "modelPuntoEmision_");
                    that.getOwnerComponent().setModel(modelRecords, "modelRecord_");

                } else if (response.EX_RESULT = 'E' && response.EX_MESSAGE=="usuario_sin_punto_emision") {
                    //that._buildDialog(that.get_i18n("dialog_informacion"), "Information", that.get_i18n(response.EX_MESSAGE)).open();
                }else if (response.EX_RESULT = 'E') {
                    that._buildDialog(that.get_i18n("dialog_error"), "Error", that.get_i18n(response.EX_MESSAGE)).open();
                } else {
                    that._buildDialog(that.get_i18n("dialog_error"), "Error", that.get_i18n("dialog_msg_8") + ' ' + URL
                        + '.\n' + that.get_i18n("dialog_msg_8_1")).open();
                }
                that.oLoader_datos.close()
            },

            //  ##################################################################################
            //                              Common Functions
            //  ##################################################################################

            getUserInfo: function () {
                let that = this;
                return new Promise(function (resolve, reject) {
                    function getemailid(value) {
                        let res = value.split("@")
                        return res[0]
                    }
                    try {
                        if (top.sap.ushell != undefined) {
                            let user = top.sap.ushell.Container.getUser();
                            that.userConnected = user.getEmail() != undefined ? getemailid(user.getEmail()) : 'usuarioDefecto';
                        } else {
                            that.userConnected = 'usuarioDefecto';
                        }
                        resolve();
                    } catch (e) {
                        console.log('No se logro obtener el usuario', e);
                        that._buildDialog(that.get_i18n("dialog_error"), "Error", that.get_i18n("dialog_msg_9")).open();
                        resolve();
                    }
                });
            },

            requestCAP: function (Url, oData, request) {
                var oModel = new sap.ui.model.json.JSONModel();

                return new Promise(function (resolve, reject) {
                    oModel.loadData(Url, JSON.stringify(oData), true, request, false, true, {
                        "content-type": "application/json;odata.metadata=minimal"
                    });
                    oModel.attachRequestCompleted(function (a, b, c) {
                        var data = oModel.getData();
                        resolve(data)
                    });
                    oModel.attachRequestFailed(function (a, b, c) {
                        var xhr = oModel.getData();
                        var result = { EX_RESULT: "Error", EX_MESSAGE: "Error", body: xhr }
                        resolve(result);
                    });
                })
            },

            get_i18n: function (key) {
                var that = this;
                return that.getOwnerComponent().getModel("i18n").getResourceBundle().getText(key);
            },
            i18nComboBox: function (v) {
                var that = this;
                return (v != null ? that.get_i18n(v) : "");
            },

            //##############################################################################################################
            //#################### NAVEGACION ENTRE PAGINAS ################################################################
            //##############################################################################################################

            // NAV FORWARD
            handleNav: async function (oEvent) {
                var that = this;
                var navCon = this.byId("mNavContainer");
                navCon.to(this.byId("idPageDetail"), "slide");

                let jsonmodel = new JSONModel([]);
                that.getOwnerComponent().setModel(jsonmodel, 'modelDetail');

                // Obtener ID para hacer POST a CAP
                var oItem = oEvent.getSource();
                var oBindingContext = oItem.getBindingContext('modelUsers');
                var oModel = this.getView().getModel('modelUsers');
                var oItemCategory = oModel.getProperty(oBindingContext.getPath());
                let oID = oItemCategory.ID
                that.actualoID = oID;
                //Manda ID al read loadDetail y trae los datos , aplicar a un modelo detail para su edicion.
                that.loadDetail(oID);
            },

            // NAV BACK
            handleNav_back: async function (oEvent) {
                var that = this;
                var navCon = that.byId("mNavContainer");
                navCon.to(that.byId("idPageMain"), "slide");
                that.resetButtons_();
                that.resetButtons();
                that.loadModel();
            },

            //##############################################################################################################
            //##################### FUNCIONES  LOG - SORT - SEARCH - DELETE ################################################
            //##############################################################################################################

            //LOG 
            onSelected_log: function (oEvent) {
                var that = this;
                if (that.byId('checkBox_log').getSelected()) {
                    sap.ui.getCore().byId(that.createId("oTable_usMod")).setVisible(true);
                    sap.ui.getCore().byId(that.createId("oTable_fechMod")).setVisible(true);
                    sap.ui.getCore().byId(that.createId("oTable_usCre")).setVisible(true);
                    sap.ui.getCore().byId(that.createId("oTable_fechCre")).setVisible(true);
                } else {
                    sap.ui.getCore().byId(that.createId("oTable_usMod")).setVisible(false);
                    sap.ui.getCore().byId(that.createId("oTable_fechMod")).setVisible(false);
                    sap.ui.getCore().byId(that.createId("oTable_usCre")).setVisible(false);
                    sap.ui.getCore().byId(that.createId("oTable_fechCre")).setVisible(false);
                }
            },
            // LOG 
            onSelected_log_: function (oEvent) {
                if (sap.ui.getCore().byId('checkBox_log_').getSelected()) {
                    sap.ui.getCore().byId("oTable_usMod_").setVisible(true);
                    sap.ui.getCore().byId("oTable_fechMod_").setVisible(true);
                    sap.ui.getCore().byId("oTable_usCre_").setVisible(true)
                    sap.ui.getCore().byId("oTable_fechCre_").setVisible(true);
                } else {
                    sap.ui.getCore().byId("oTable_usMod_").setVisible(false);
                    sap.ui.getCore().byId("oTable_fechMod_").setVisible(false);
                    sap.ui.getCore().byId("oTable_usCre_").setVisible(false)
                    sap.ui.getCore().byId("oTable_fechCre_").setVisible(false);
                }
            },
            //Sort

            // handler Dialogs Sort 
            handleSortButtonPressed: function () {
                this.createViewSettingsDialog("sgddmusers.fragments.SortDialog").open();
            },
            handleSortDialogConfirm: function (oEvent) {
                var that = this;
                var oTable = that.byId('oTable'),
                    mParams = oEvent.getParameters(),
                    oBinding = oTable.getBinding("items"),
                    sPath,
                    bDescending,
                    aSorters = [];
                sPath = mParams.sortItem.getKey();
                bDescending = mParams.sortDescending;
                aSorters.push(new Sorter(sPath, bDescending));
                oBinding.sort(aSorters);
            },
            // handler Dialogs Sort 
            handleSortButtonPressed_: function () {
                this.createViewSettingsDialog("sgddmusers.fragments.SortDialog_").open();
            },
            handleSortDialogConfirm_: function (oEvent) {
                var that = this;
                var oTable = sap.ui.getCore().byId('oTable_'),
                    mParams = oEvent.getParameters(),
                    oBinding = oTable.getBinding("items"),
                    sPath,
                    bDescending,
                    aSorters = [];
                sPath = mParams.sortItem.getKey();
                bDescending = mParams.sortDescending;
                aSorters.push(new Sorter(sPath, bDescending));
                oBinding.sort(aSorters);
            },
            //Searchfield Destinatario
            onChangeBuscar: function (evento) {
                //Array para bindear filtros
                var aFilters = [];
                //Valor de la query al momento del evento
                var sQuery = evento.getSource().getValue();

                if (sQuery && sQuery.length > 0) {
                    //Agregar filtros y pushearlos al array segun corresponda , los campos del filter se rellenan con el nombre que tienen en el modelo no el i18n.
                    var oFilter = new Filter("userID", FilterOperator.Contains, sQuery);
                    aFilters.push(oFilter);
                    var oFilter = new Filter("name", FilterOperator.Contains, sQuery);
                    aFilters.push(oFilter);
                    //Aqui se recopilan todos los filtros de los array anteriores
                    var oFilters = new Filter(aFilters);

                }
                var oTable = this.getView().byId('oTable');
                //Seleccionar items a vincular
                var oBindingInfo = oTable.getBinding("items");
                //Entregar Filtro para los items
                oBindingInfo.filter(oFilters, oTable);


            },
            //Searchfield 
            onChangeBuscarTable_: function (evento) {
                //Array para bindear filtros
                var aFilters = [];
                //Valor de la query al momento del evento
                var sQuery = evento.getSource().getValue();

                if (sQuery && sQuery.length > 0) {
                    //Agregar filtros y pushearlos al array segun corresponda , los campos del filter se rellenan con el nombre que tienen en el modelo no el i18n.
                    var oFilter = new Filter("companyCode", FilterOperator.Contains, sQuery);
                    aFilters.push(oFilter);
                    var oFilter = new Filter("companyName", FilterOperator.Contains, sQuery);
                    aFilters.push(oFilter);
                    var oFilter = new Filter("divisionName", FilterOperator.Contains, sQuery);
                    aFilters.push(oFilter);
                    //Aqui se recopilan todos los filtros de los array anteriores
                    var oFilters = new Filter(aFilters);

                }
                var oTable = sap.ui.getCore().byId("oTable_");
                //Seleccionar items a vincular
                var oBindingInfo = oTable.getBinding("items");
                //Entregar Filtro para los items
                oBindingInfo.filter(oFilters, oTable);

            },
            //Edit Button 
            onEdit_: function () {
                if (sap.ui.getCore().byId('editButton_').getText() == this.get_i18n("iconTab_Editar")) {
                    sap.ui.getCore().byId('editButton_').setText(this.getView().getModel("i18n").getResourceBundle().getText("iconTab_Cerrar_Editar"));
                    sap.ui.getCore().byId('col_editButton_').setVisible(true);

                } else {
                    sap.ui.getCore().byId('editButton_').setText(this.getView().getModel("i18n").getResourceBundle().getText("iconTab_Editar"));
                    sap.ui.getCore().byId('col_editButton_').setVisible(false);
                }
            },
            // Delete button 
            onDelete: function () {
                if (this.byId('deleteButton').getText() == this.get_i18n("iconTab_Eliminar")) {
                    this.byId('deleteButton').setText(this.getView().getModel("i18n").getResourceBundle().getText("iconTab_Cerrar_Eliminar"));
                    this.byId('col_deleteButton').setVisible(true);

                } else {
                    this.byId('deleteButton').setText(this.getView().getModel("i18n").getResourceBundle().getText("iconTab_Eliminar"));
                    this.byId('col_deleteButton').setVisible(false);
                }

            },
            //Delete button 
            onDelete_: function () {
                if (sap.ui.getCore().byId('deleteButton_').getText() == this.get_i18n("iconTab_Eliminar")) {
                    sap.ui.getCore().byId('deleteButton_').setText(this.getView().getModel("i18n").getResourceBundle().getText("iconTab_Cerrar_Eliminar"));
                    sap.ui.getCore().byId('col_deleteButton_').setVisible(true);

                } else {
                    sap.ui.getCore().byId('deleteButton_').setText(this.getView().getModel("i18n").getResourceBundle().getText("iconTab_Eliminar"));
                    sap.ui.getCore().byId('col_deleteButton_').setVisible(false);
                }
            },
            // Crear DIALOG + SETTINGS
            createViewSettingsDialog: function (sDialogFragmentName) {
                var that = this;
                var oDialog = sap.ui.xmlfragment(sDialogFragmentName, this);
                that.getView().addDependent(oDialog);
                if (Device.system.desktop) {
                    oDialog.addStyleClass("sapUiSizeCompact");
                }
                return oDialog;
            },
            getRowModelByKey: function(combo, modelName, propertyName){
                let that=this
                let key = combo.getSelectedKey()
                let oData=that.getView().getModel(modelName).getData()
                let obj={}
                for(let i in oData){
                    if(oData[i][propertyName]==key){
                        obj=oData[i]
                        break
                    }
                }
                return obj
            },
            // ##############################################################################################################
            // POP UPS ######################################################################################################
            _pop_crearRegistro: function (oEvent) {
                var that = this;
                if (that._oDialog) {
                    that._oDialog.destroy();
                }
                that._oDialog = new sap.ui.xmlfragment("sgddmusers.fragments.Create", that);
                that.getView().addDependent(that._oDialog);
                jQuery.sap.syncStyleClass("sapUiSizeCompact", that.getView(), that._oDialog);
                that._oDialog.open();
            },
            _pop_crear_: async function (oEvent) {
                var that = this;
                if (that._oDialog) {
                    that._oDialog.destroy();
                }
                that._oDialog = new sap.ui.xmlfragment("sgddmusers.fragments.Create_", that);
                that.getView().addDependent(that._oDialog);
                jQuery.sap.syncStyleClass("sapUiSizeCompact", that.getView(), that._oDialog);
                that._oDialog.open();
                that.loadModelCompania()
            },
            _pop_editar_: async function (oEvent) {
                var that = this;
                var indice = oEvent.oSource.getParent().getBindingContextPath().replace('/', '')
                let databyIndice = this.getView().getModel("modelPuntoEmision_").getData()[indice]
                let modelobyIndice = new JSONModel(databyIndice);
                that.getOwnerComponent().setModel(modelobyIndice, "modelPuntoEmision_popup")

                if (that._oDialog) {
                    that._oDialog.destroy();
                }
                that._oDialog = new sap.ui.xmlfragment("sgddmusers.fragments.EditDetalle_", that);
                that.getView().addDependent(that._oDialog);
                jQuery.sap.syncStyleClass("sapUiSizeCompact", that.getView(), that._oDialog);
                that._oDialog.open();
                that.oLoader_datos.open();
                await that.loadModelCompania()
                sap.ui.getCore().byId('oCombobox_compania').setSelectedKey(this.getView().getModel("modelPuntoEmision_popup").getProperty("/companyCode"))
                let obj = that.getRowModelByKey(sap.ui.getCore().byId('oCombobox_compania'), 'modelCompania', 'code')
                await that.loadModelDivision_(obj.ID)
                sap.ui.getCore().byId('oCombobox_division').setSelectedKey(this.getView().getModel("modelPuntoEmision_popup").getProperty("/divisionCode"))
                obj = that.getRowModelByKey(sap.ui.getCore().byId('oCombobox_division'), 'modelDivision', 'code')
                await that.loadModelSucursal(obj.ID)
                sap.ui.getCore().byId('oCombobox_sucursal').setSelectedKey(this.getView().getModel("modelPuntoEmision_popup").getProperty("/officeCode"))
                obj = that.getRowModelByKey(sap.ui.getCore().byId('oCombobox_sucursal'), 'modelSucursal', 'code')
                await that.loadModelPuntoEmision_(obj.ID)
                sap.ui.getCore().byId('oCombobox_puntoEmision').setSelectedKey(this.getView().getModel("modelPuntoEmision_popup").getProperty("/emissionPointCode"))
                sap.ui.getCore().byId('oCheckbox_Vigente').setSelected(this.getView().getModel("modelPuntoEmision_popup").getProperty("/active"))
                that.oLoader_datos.close();
            },
            _CerrarPopup: function (oEvent) {
                var that = this;
                that._oDialog.close();
            },
            // ############################################################ DIALOGS #######################################

            _buildDialog: function (_title, _state, _text) {
                var that = this;
                var dialog = new sap.m.Dialog({
                    title: _title,
                    type: 'Message',
                    state: _state,
                    content: new sap.m.Text({
                        text: _text
                    }),
                    beginButton: new sap.m.Button({
                        text: that.get_i18n("aceptar"),
                        press: function () {
                            dialog.close();
                        }
                    }),
                    afterClose: function () {
                        // that.reiniciarFormulario();
                        dialog.destroy();
                    }
                });
                return dialog;
            },
            _confirmDialogCreate: function () {
                var that = this;
                var oDialogConfirm = that._confirmDialog(that.get_i18n("dialog_title_crear"), "Warning",
                    that.get_i18n("dialog_msg_1"), "crear");
                oDialogConfirm.open();
            },
            _confirmDialogEditDetalle: function (index) {
                var that = this;
                var oDialogConfirm = that._confirmDialog(that.get_i18n("dialog_title_crear"), "Warning",
                    that.get_i18n("dialog_msg_3"), "editar_detalle");
                oDialogConfirm.open();
            },
            _confirmDialogEliminar: async function (oEvent) {
                var that = this;
                var indice = oEvent.oSource.getParent().getBindingContextPath().replace('/', '')
                that.indexEliminar = indice
                let consultaID = that.getOwnerComponent().getModel('modelUsers').oData[indice].ID
                let oDataConsulta = { "ID": consultaID }
                let URL = 'sgdd/maintainer/readUser'
                let response = await that.requestCAP(URL, oDataConsulta, 'POST');
                if (response.EX_RESULT == 'S') {
                    var oDialogConfirm = that._confirmDialog(that.get_i18n("dialog_title_eliminar"), "Warning",
                        that.get_i18n("dialog_msg_5"), "eliminar");
                    oDialogConfirm.open();
                } else if (response.EX_RESULT == 'E') {
                    var oDialogConfirm = that._confirmDialog(that.get_i18n("dialog_title_eliminar"), "Warning",
                        that.get_i18n("dialog_msg_5"), "eliminar");
                    oDialogConfirm.open();
                } else {
                    var oDialogConfirm = that._buildDialog(that.get_i18n("dialog_title_eliminar"), "Error",
                        that.get_i18n(response.EX_MESSAGE), "");
                    oDialogConfirm.open();
                }
            },
            _confirmDialogCreate_: function () {
                var that = this;
                var oDialogConfirm = that._confirmDialog(that.get_i18n("dialog_title_crear"), "Warning",
                    that.get_i18n("dialog_msg_10"), "crear_");
                oDialogConfirm.open();
            },
            _confirmDialogEdit_: function () {
                var that = this;
                var oDialogConfirm = that._confirmDialog(that.get_i18n("dialog_title_editar"), "Warning",
                    that.get_i18n("dialog_msg_11"), "editar_detalle_");
                oDialogConfirm.open();
            },
            _confirmDialogEliminar_: async function (oEvent) {
                var that = this;
                var indice = oEvent.oSource.getParent().getBindingContextPath().replace('/', '')
                that.indexEliminar_ = indice
                var oDialogConfirm = that._confirmDialog(that.get_i18n("dialog_title_eliminar"), "Warning",
                    that.get_i18n("dialog_msg_6"), "eliminar_");
                oDialogConfirm.open();
            },

            // ###################################### OPERACIONES CRUD ##########################################################
            //Create
            _crear: async function () {
                let that = this;
                if (that._validaFiltros("crear").length > 0) {
                    that._buildDialog(that.get_i18n("dialog_error"), "Error", that.get_i18n("dialog_msg_4") + "\n\n" + that
                        ._validaFiltros()).open();
                } else {
                    let oInput_RUT = sap.ui.getCore().byId('oInput_RUT').getValue()
                    let oInput_nombre = sap.ui.getCore().byId('oInput_nombre').getValue()
                    let oInput_userId = sap.ui.getCore().byId('oInput_userId').getValue()
                    let oInput_email = sap.ui.getCore().byId('oInput_email').getValue()
                    let oDatePicker_vigente_hasta = sap.ui.getCore().byId('oDatePicker_vigente_hasta').getValue()

                    let oData = {
                        "user": {
                            userID: oInput_userId,
                            name: oInput_nombre,
                            rut: oInput_RUT,
                            email: oInput_email,
                            effectiveDate: oDatePicker_vigente_hasta,
                            createdBy: that.userConnected
                        }
                    };
                    let URL = 'sgdd/maintainer/createUser';
                    let response = await that.requestCAP(URL, oData, 'POST');
                    if (response.EX_RESULT == 'S') {
                        that._oDialog.close();
                        that.loadModel();
                    } else if (response.EX_RESULT = 'E') {
                        that._buildDialog(that.get_i18n("dialog_error"), "Error", that.get_i18n(response.EX_MESSAGE)).open();
                    } else {
                        that._buildDialog(that.get_i18n("dialog_error"), "Error", that.get_i18n("dialog_msg_8") + ' ' + URL
                            + '.\n' + that.get_i18n("dialog_msg_8_1")).open();
                    }

                }

            },

            _crear_: async function () {
                let that = this;
                that.oFlag_ = true
                if (that._validaFiltros("valida_crear_pto_emision").length > 0) {
                    that.oFlag_ = true
                    that._buildDialog(that.get_i18n("dialog_error"), "Error", that.get_i18n("dialog_msg_4") + "\n\n" + that
                        ._validaFiltros("valida_crear_pto_emision")).open();
                } else {

                    let oCombobox_compania =that.getRowModelByKey(sap.ui.getCore().byId('oCombobox_compania'), 'modelCompania', 'code')// sap.ui.getCore().byId('oCombobox_compania').getSelectedKey()
                    let oCombobox_division = that.getRowModelByKey(sap.ui.getCore().byId('oCombobox_division'), 'modelDivision', 'code')//sap.ui.getCore().byId('oCombobox_division').getSelectedKey()
                    let oCombobox_sucursal = that.getRowModelByKey(sap.ui.getCore().byId('oCombobox_sucursal'), 'modelSucursal', 'code')//sap.ui.getCore().byId('oCombobox_sucursal').getSelectedKey()
                    let oCombobox_puntoEmision = that.getRowModelByKey(sap.ui.getCore().byId('oCombobox_puntoEmision'), 'modelPuntoEmision', 'code')//sap.ui.getCore().byId('oCombobox_puntoEmision').getSelectedKey()
                    let valorVigencia = sap.ui.getCore().byId('oCheckbox_Vigente').getSelected()
                    let oData = {
                            userEmissionPoint: {
                                companyCode: oCombobox_compania.code,
                                companyName: oCombobox_compania.name,
                                companyRut: oCombobox_compania.rut,
                                divisionCode: oCombobox_division.code,
                                divisionName: oCombobox_division.name,
                                officeCode: oCombobox_sucursal.code,
                                officeName: oCombobox_sucursal.name,
                                emissionPointCode: oCombobox_puntoEmision.code,
                                emissionPointName: oCombobox_puntoEmision.name,
                                active: valorVigencia,
                                user_ID: that.actualoID,
                                createdBy: that.userConnected
                            }
                    }
                    let URL = 'sgdd/maintainer/createUserEmissionPoint';
                    let response = await that.requestCAP(URL, oData, 'POST');
                    if (response.EX_RESULT == 'S') {
                        that._oDialog.close();
                        that.loadPuntoEmision(that.actualoID);
                    } else if (response.EX_RESULT = 'E' && response.EX_MESSAGE == 'categoria_ya_existe') {
                        that._buildDialog(that.get_i18n("dialog_error"), "Error", that.get_i18n("categoria_ya_existe")).open();
                    } else if (response.EX_RESULT = 'E' && response.EX_MESSAGE == 'categoria_no_existe') {
                        that._buildDialog(that.get_i18n("dialog_error"), "Error", that.get_i18n("categoria_no_existe")).open();
                    } else {
                        that._buildDialog(that.get_i18n("dialog_error"), "Error", that.get_i18n("dialog_msg_8") + ' ' + URL
                            + '.\n' + that.get_i18n("dialog_msg_8_1")).open();
                    }

                }
            },
            // Edit
            _editarDetalle: async function () {
                let that = this;
                if (that._validaFiltros("detalle").length > 0) {
                    that._buildDialog(that.get_i18n("dialog_error"), "Error", that.get_i18n("dialog_msg_4") + "\n\n" + that
                        ._validaFiltros()).open();
                } else {
                    let oInput_RUT_ = sap.ui.getCore().byId('oInput_RUT_').getValue()
                    let oInput_nombre_ = sap.ui.getCore().byId('oInput_nombre_').getValue()
                    let oInput_userId_ = sap.ui.getCore().byId('oInput_userId_').getValue()
                    let oInput_email_ = sap.ui.getCore().byId('oInput_email_').getValue()
                    let oDatePicker_vigente_hasta_ = sap.ui.getCore().byId('oDatePicker_vigente_hasta_').getValue()

                    let id = that.actualoID
                    let oDataDetail = {
                        user: {
                            ID: id,
                            userID: oInput_userId_,
                            name: oInput_nombre_,
                            rut: oInput_RUT_,
                            email: oInput_email_,
                            effectiveDate: oDatePicker_vigente_hasta_,
                            modifiedBy: that.userConnected
                        }
                    };
                    let URL = 'sgdd/maintainer/updateUser';
                    let response = await that.requestCAP(URL, oDataDetail, 'POST');
                    if (response.EX_RESULT == 'S') {
                        that._toggleButtonsAndView(false);
                        that.loadDetail(id);
                    } else if (response.EX_RESULT = 'E') {
                        that._buildDialog(that.get_i18n("dialog_error"), "Error", that.get_i18n(response.EX_MESSAGE)).open();
                    } else {
                        that._buildDialog(that.get_i18n("dialog_error"), "Error", that.get_i18n("dialog_msg_8") + ' ' + URL
                            + '.\n' + that.get_i18n("dialog_msg_8_1")).open();
                    }
                }
            },
            _editarDetalle_: async function () {
                let that = this;
                if (that._validaFiltros('valida_crear_pto_emision').length > 0) {
                    that._buildDialog(that.get_i18n("dialog_error"), "Error", that.get_i18n("dialog_msg_4") + "\n\n" + that
                        ._validaFiltros('valida_crear_pto_emision')).open();
                } else {
                    let that = this;
                    let oCombobox_compania =that.getRowModelByKey(sap.ui.getCore().byId('oCombobox_compania'), 'modelCompania', 'code')// sap.ui.getCore().byId('oCombobox_compania').getSelectedKey()
                    let oCombobox_division = that.getRowModelByKey(sap.ui.getCore().byId('oCombobox_division'), 'modelDivision', 'code')//sap.ui.getCore().byId('oCombobox_division').getSelectedKey()
                    let oCombobox_sucursal = that.getRowModelByKey(sap.ui.getCore().byId('oCombobox_sucursal'), 'modelSucursal', 'code')//sap.ui.getCore().byId('oCombobox_sucursal').getSelectedKey()
                    let oCombobox_puntoEmision = that.getRowModelByKey(sap.ui.getCore().byId('oCombobox_puntoEmision'), 'modelPuntoEmision', 'code')//sap.ui.getCore().byId('oCombobox_puntoEmision').getSelectedKey()
                    let valorVigencia = sap.ui.getCore().byId('oCheckbox_Vigente').getSelected()
                    let id = this.getView().getModel("modelPuntoEmision_popup").getProperty("/ID")
                    let oData = {
                            userEmissionPoint: {
                                ID: id,
                                companyCode: oCombobox_compania.code,
                                companyName: oCombobox_compania.name,
                                companyRut: oCombobox_compania.rut,
                                divisionCode: oCombobox_division.code,
                                divisionName: oCombobox_division.name,
                                officeCode: oCombobox_sucursal.code,
                                officeName: oCombobox_sucursal.name,
                                emissionPointCode: oCombobox_puntoEmision.code,
                                emissionPointName: oCombobox_puntoEmision.name,
                                active: valorVigencia,
                                user_ID: that.actualoID,
                                modifiedBy: that.userConnected
                            }
                    }
                    let URL = 'sgdd/maintainer/updateUserEmissionPoint';
                    let response = await that.requestCAP(URL, oData, 'POST');
                    if (response.EX_RESULT == 'S') {
                        that._oDialog.close();
                        that.loadPuntoEmision(that.actualoID);
                    } else if (response.EX_RESULT = 'E') {
                        that._buildDialog(that.get_i18n("dialog_error"), "Error", that.get_i18n(response.EX_MESSAGE)).open();
                    } else {
                        that._buildDialog(that.get_i18n("dialog_error"), "Error", that.get_i18n("dialog_msg_8") + ' ' + URL
                            + '.\n' + that.get_i18n("dialog_msg_8_1")).open();
                    }
                }
            },
            // Cargar detalle item seleccionado

            loadDetail: async function (oID) {
                let that = this;
                let URL = 'sgdd/maintainer/readUser'
                let oData = {
                    "ID": that.actualoID
                }
                let oModelDetail = new JSONModel([]);
                that.getOwnerComponent().setModel(oModelDetail, 'modelDetail')   
                that.oLoader_detalle.open()
                let response = await that.requestCAP(URL, oData, 'POST');
                that.oLoader_detalle.close()

                if (response.EX_RESULT == 'S') {
                    let oModelDetail = new JSONModel(response.EX_DATA);                   
                    that.getOwnerComponent().setModel(oModelDetail, 'modelDetail')  
                    that.loadPuntoEmision(that.actualoID);

                } else if (response.EX_RESULT = 'E') {
                    that._buildDialog(that.get_i18n("dialog_error"), "Error", that.get_i18n(response.EX_MESSAGE) ).open();
                } else {
                    that._buildDialog(that.get_i18n("dialog_error"), "Error", that.get_i18n("dialog_msg_8") + ' ' + URL
                        + '.\n' + that.get_i18n("dialog_msg_8_1")).open();
                }
                that._fragment("MostrarDetalle");

            },
            //Delete 
            _eliminar: async function () {
                let that = this;
                let indice = that.indexEliminar;
                let id = that.getOwnerComponent().getModel('modelUsers').oData[indice].ID;
                let oData = {
                    "ID": id,

                };
                let URL = 'sgdd/maintainer/deleteUser'
                await that.requestCAP(URL, oData, 'POST');
                that.loadModel()
            },
            //Delete 
            _eliminar_: async function () {
                let that = this;
                let indice = that.indexEliminar_;
                let id = that.getOwnerComponent().getModel('modelPuntoEmision_').oData[indice].ID;
                let oData = {
                    "ID": id,
                    "user": that.userConnected
                };
                let URL = 'sgdd/maintainer/deleteUserEmissionPoint'
                let response = await that.requestCAP(URL, oData, 'POST');
                if (response.EX_RESULT == 'S') {
                    that.oLoader_datos.open();
                    that.loadPuntoEmision(that.actualoID);
                    that.oLoader_datos.close();

                } else if (response.EX_RESULT = 'E') {
                    that._buildDialog(that.get_i18n("dialog_error"), "Error", that.get_i18n(response.EX_MESSAGE)).open();
                } else {
                    that._buildDialog(that.get_i18n("dialog_error"), "Error", that.get_i18n("dialog_msg_8") + ' ' + URL
                        + '.\n' + that.get_i18n("dialog_msg_8_1")).open();
                }

            },
            //VALIDAR FILTROS
            _validaFiltros: function (value) {
                var that = this;
                var msg = "";
                if (value=="crear") {
                    let oInput_RUT = sap.ui.getCore().byId('oInput_RUT').getValue()
                    let oInput_nombre = sap.ui.getCore().byId('oInput_nombre').getValue()
                    let oInput_userId = sap.ui.getCore().byId('oInput_userId').getValue()
                    let oInput_email = sap.ui.getCore().byId('oInput_email').getValue()
                    let oDatePicker_vigente_hasta = sap.ui.getCore().byId('oDatePicker_vigente_hasta').getValue()

                    if (oInput_RUT == "") {
                        msg = msg + "-" + that.get_i18n("RUT") + "\n";
                    }
                    if (oInput_nombre == "") {
                        msg = msg + "-" + that.get_i18n("NOMBRE") + "\n";
                    }
                    if (oInput_userId == "") {
                        msg = msg + "-" + that.get_i18n("ID_USUARIO") + "\n";
                    }
                    if (oInput_email == "") {
                        msg = msg + "-" + that.get_i18n("EMAIL") + "\n";
                    }else if(!that.validateEmail(oInput_email)){
                        msg = msg + "-" + that.get_i18n("EMAIL") + "\n";
                    }
                    if(oDatePicker_vigente_hasta==""){
                        msg = msg + "-" + that.get_i18n("FECHA") + "\n";
                    }else{
                        if(!that.validarFecha_(oDatePicker_vigente_hasta)){
                            msg = msg + "-" + that.get_i18n("dialog_msg_13") + "\n";
                        }
                    }

                    
                }else if(value=="detalle"){
                    let oInput_RUT = sap.ui.getCore().byId('oInput_RUT_').getValue()
                    let oInput_nombre = sap.ui.getCore().byId('oInput_nombre_').getValue()
                    let oInput_userId = sap.ui.getCore().byId('oInput_userId_').getValue()
                    let oInput_email = sap.ui.getCore().byId('oInput_email_').getValue()
                    let oDatePicker_vigente_hasta = sap.ui.getCore().byId('oDatePicker_vigente_hasta_').getValue()

                    if (oInput_RUT == "") {
                        msg = msg + "-" + that.get_i18n("RUT") + "\n";
                    }
                    if (oInput_nombre == "") {
                        msg = msg + "-" + that.get_i18n("NOMBRE") + "\n";
                    }
                    if (oInput_userId == "") {
                        msg = msg + "-" + that.get_i18n("ID_USUARIO") + "\n";
                    }
                    if (oInput_email == "") {
                        msg = msg + "-" + that.get_i18n("EMAIL") + "\n";
                    }else if(!that.validateEmail(oInput_email)){
                        msg = msg + "-" + that.get_i18n("EMAIL") + "\n";
                    }
                    if(oDatePicker_vigente_hasta==""){
                        msg = msg + "-" + that.get_i18n("FECHA") + "\n";
                    }else{
                        if(!that.validarFecha_(oDatePicker_vigente_hasta)){
                            msg = msg + "-" + that.get_i18n("dialog_msg_13") + "\n";
                        }
                    }
                }else if(value=="valida_crear_pto_emision"){
                    let oCombobox_compania = sap.ui.getCore().byId('oCombobox_compania').getSelectedKey()
                    let oCombobox_division = sap.ui.getCore().byId('oCombobox_division').getSelectedKey()
                    let oCombobox_sucursal = sap.ui.getCore().byId('oCombobox_sucursal').getSelectedKey()
                    let oCombobox_puntoEmision = sap.ui.getCore().byId('oCombobox_puntoEmision').getSelectedKey()

                    if (oCombobox_compania == "") {
                        msg = msg + "-" + that.get_i18n("COMPANIA") + "\n";
                    }
                    if (oCombobox_division == "") {
                        msg = msg + "-" + that.get_i18n("DIVISIONES") + "\n";
                    }
                    if (oCombobox_sucursal == "") {
                        msg = msg + "-" + that.get_i18n("SUCURSAL") + "\n";
                    }
                    if (oCombobox_puntoEmision == "") {
                        msg = msg + "-" + that.get_i18n("PUNTO_EMISION") + "\n";
                    }
                }
                return msg;
            },
            loadModelCompania: async function () {
                let that = this;
                // Cargar oData Inicial
                var URL = "sgdd/maintainer/readCompany";
                var oData = {
                    "ID": ""
                };

                sap.ui.getCore().byId('oCombobox_division').setEnabled(false)
                sap.ui.getCore().byId('oCombobox_sucursal').setEnabled(false)
                sap.ui.getCore().byId('oCombobox_puntoEmision').setEnabled(false)
                

                let oModel = new JSONModel([]);
                that.getOwnerComponent().setModel(oModel, "modelDivision");
                that.getOwnerComponent().setModel(oModel, "modelSucursal");
                that.getOwnerComponent().setModel(oModel, "modelPuntoEmision");

                
                sap.ui.getCore().byId('oCombobox_division').setSelectedKey('')
                sap.ui.getCore().byId('oCombobox_sucursal').setSelectedKey('')
                sap.ui.getCore().byId('oCombobox_puntoEmision').setSelectedKey('')

                oModel = new JSONModel([]);
                that.getOwnerComponent().setModel(oModel, "modelCompania");
                //Dialogo Cargar + Accion POST
                sap.ui.getCore().byId('oCombobox_compania').setBusy(true)
                let response = await that.requestCAP(URL, oData, 'POST');
                sap.ui.getCore().byId('oCombobox_compania').setBusy(false)
                if (response.EX_RESULT == 'S') {
                    oModel = new JSONModel(response.EX_DATA);
                    that.getOwnerComponent().setModel(oModel, "modelCompania");
                    sap.ui.getCore().byId('oCombobox_compania').setEnabled(true)
                } else if (response.EX_RESULT = 'E') {
                    that._buildDialog(that.get_i18n("dialog_error"), "Error", that.get_i18n(response.EX_MESSAGE)).open();
                } else {
                    that._buildDialog(that.get_i18n("dialog_error"), "Error", that.get_i18n("dialog_msg_8") + ' ' + URL
                        + '.\n' + that.get_i18n("dialog_msg_8_1")).open();
                }
            },
            loadModelDivision: async function (oEvent) {
                let that = this;
                // Cargar oData Inicial
                var URL = "sgdd/maintainer/getDivisionByCompany";
                var obj  = that.getRowModelByKey(sap.ui.getCore().byId('oCombobox_compania'), 'modelCompania', 'code')
                var oData = {
                    "company_ID": obj.ID
                };
                sap.ui.getCore().byId('oCombobox_division').setEnabled(false)
                sap.ui.getCore().byId('oCombobox_sucursal').setEnabled(false)
                sap.ui.getCore().byId('oCombobox_puntoEmision').setEnabled(false)
                
                sap.ui.getCore().byId('oCombobox_division').setSelectedKey('')
                sap.ui.getCore().byId('oCombobox_sucursal').setSelectedKey('')
                sap.ui.getCore().byId('oCombobox_puntoEmision').setSelectedKey('')

                let oModel = new JSONModel([]);
                that.getOwnerComponent().setModel(oModel, "modelSucursal");
                that.getOwnerComponent().setModel(oModel, "modelPuntoEmision");

                oModel = new JSONModel([]);
                that.getOwnerComponent().setModel(oModel, "modelDivision");
                //Dialogo Cargar + Accion POST
                sap.ui.getCore().byId('oCombobox_division').setBusy(true)
                let response = await that.requestCAP(URL, oData, 'POST');
                sap.ui.getCore().byId('oCombobox_division').setBusy(false)                

                if (response.EX_RESULT == 'S') {
                    oModel = new JSONModel(response.EX_DATA);
                    that.getOwnerComponent().setModel(oModel, "modelDivision");
                    sap.ui.getCore().byId('oCombobox_division').setEnabled(true)
                } else if (response.EX_RESULT = 'E' && response.EX_MESSAGE=="empresa_sin_division") {
                    that._buildDialog(that.get_i18n("dialog_informacion"), "Information", that.get_i18n(response.EX_MESSAGE)).open();
                }else if (response.EX_RESULT = 'E') {
                    that._buildDialog(that.get_i18n("dialog_error"), "Error", that.get_i18n(response.EX_MESSAGE)).open();
                } else {
                    that._buildDialog(that.get_i18n("dialog_error"), "Error", that.get_i18n("dialog_msg_8") + ' ' + URL
                        + '.\n' + that.get_i18n("dialog_msg_8_1")).open();
                }
            },
            loadModelDivision_: async function (id) {
                let that = this;
                // Cargar oData Inicial
                var URL = "sgdd/maintainer/getDivisionByCompany";
                //var obj  = that.getRowModelByKey(sap.ui.getCore().byId('oCombobox_compania'), 'modelCompania', 'code')
                var oData = {
                    "company_ID": id
                };
                
                sap.ui.getCore().byId('oCombobox_division').setEnabled(false)
                sap.ui.getCore().byId('oCombobox_sucursal').setEnabled(false)
                sap.ui.getCore().byId('oCombobox_puntoEmision').setEnabled(false)
                
                sap.ui.getCore().byId('oCombobox_division').setSelectedKey('')
                sap.ui.getCore().byId('oCombobox_sucursal').setSelectedKey('')
                sap.ui.getCore().byId('oCombobox_puntoEmision').setSelectedKey('')

                let oModel = new JSONModel([]);
                that.getOwnerComponent().setModel(oModel, "modelSucursal");
                that.getOwnerComponent().setModel(oModel, "modelPuntoEmision");

                oModel = new JSONModel([]);
                that.getOwnerComponent().setModel(oModel, "modelDivision");
                //Dialogo Cargar + Accion POST
                sap.ui.getCore().byId('oCombobox_division').setBusy(true)
                let response = await that.requestCAP(URL, oData, 'POST');
                sap.ui.getCore().byId('oCombobox_division').setBusy(false)                

                if (response.EX_RESULT == 'S') {
                    oModel = new JSONModel(response.EX_DATA);
                    that.getOwnerComponent().setModel(oModel, "modelDivision");
                    sap.ui.getCore().byId('oCombobox_division').setEnabled(true)
                } else if (response.EX_RESULT = 'E' && response.EX_MESSAGE=="empresa_sin_division") {
                    that._buildDialog(that.get_i18n("dialog_informacion"), "Information", that.get_i18n(response.EX_MESSAGE)).open();
                }else if (response.EX_RESULT = 'E') {
                    that._buildDialog(that.get_i18n("dialog_error"), "Error", that.get_i18n(response.EX_MESSAGE)).open();
                } else {
                    that._buildDialog(that.get_i18n("dialog_error"), "Error", that.get_i18n("dialog_msg_8") + ' ' + URL
                        + '.\n' + that.get_i18n("dialog_msg_8_1")).open();
                }
            },
            loadModelSucursal: async function (oEvent) {
                let that = this;
                // Cargar oData Inicial
                var URL = "sgdd/maintainer/getOfficeByDivision";
                var obj  = that.getRowModelByKey(sap.ui.getCore().byId('oCombobox_division'), 'modelDivision', 'code')
                var oData = {
                    "division_ID": obj.ID
                };
                sap.ui.getCore().byId('oCombobox_sucursal').setEnabled(false)
                sap.ui.getCore().byId('oCombobox_puntoEmision').setEnabled(false)
                
                sap.ui.getCore().byId('oCombobox_sucursal').setSelectedKey('')
                sap.ui.getCore().byId('oCombobox_puntoEmision').setSelectedKey('')

                let oModel = new JSONModel([]);
                that.getOwnerComponent().setModel(oModel, "modelPuntoEmision");

                oModel = new JSONModel([]);
                that.getOwnerComponent().setModel(oModel, "modelSucursal");
                //Dialogo Cargar + Accion POST
                sap.ui.getCore().byId('oCombobox_sucursal').setBusy(true)
                let response = await that.requestCAP(URL, oData, 'POST');
                sap.ui.getCore().byId('oCombobox_sucursal').setBusy(false)
                if (response.EX_RESULT == 'S') {
                    oModel = new JSONModel(response.EX_DATA);
                    that.getOwnerComponent().setModel(oModel, "modelSucursal");
                    sap.ui.getCore().byId('oCombobox_sucursal').setEnabled(true)
                } else if (response.EX_RESULT = 'E' && response.EX_MESSAGE=="division_sin_sucursal") {
                    that._buildDialog(that.get_i18n("dialog_informacion"), "Information", that.get_i18n(response.EX_MESSAGE)).open();
                } else if (response.EX_RESULT = 'E') {
                    that._buildDialog(that.get_i18n("dialog_error"), "Error", that.get_i18n(response.EX_MESSAGE)).open();
                } else {
                    that._buildDialog(that.get_i18n("dialog_error"), "Error", that.get_i18n("dialog_msg_8") + ' ' + URL
                        + '.\n' + that.get_i18n("dialog_msg_8_1")).open();
                }
            },
            loadModelSucursal_: async function (id) {
                let that = this;
                // Cargar oData Inicial
                var URL = "sgdd/maintainer/getOfficeByDivision";
                //var obj  = that.getRowModelByKey(sap.ui.getCore().byId('oCombobox_division'), 'modelDivision', 'code')
                var oData = {
                    "division_ID": id
                };
                sap.ui.getCore().byId('oCombobox_sucursal').setEnabled(false)
                sap.ui.getCore().byId('oCombobox_puntoEmision').setEnabled(false)
                
                sap.ui.getCore().byId('oCombobox_sucursal').setSelectedKey('')
                sap.ui.getCore().byId('oCombobox_puntoEmision').setSelectedKey('')
                let oModel = new JSONModel([]);
                that.getOwnerComponent().setModel(oModel, "modelPuntoEmision");

                oModel = new JSONModel([]);
                that.getOwnerComponent().setModel(oModel, "modelSucursal");
                //Dialogo Cargar + Accion POST
                sap.ui.getCore().byId('oCombobox_sucursal').setBusy(true)
                let response = await that.requestCAP(URL, oData, 'POST');
                sap.ui.getCore().byId('oCombobox_sucursal').setBusy(false)
                if (response.EX_RESULT == 'S') {
                    oModel = new JSONModel(response.EX_DATA);
                    that.getOwnerComponent().setModel(oModel, "modelSucursal");
                    sap.ui.getCore().byId('oCombobox_sucursal').setEnabled(true)
                } else if (response.EX_RESULT = 'E' && response.EX_MESSAGE=="division_sin_sucursal") {
                    that._buildDialog(that.get_i18n("dialog_informacion"), "Information", that.get_i18n(response.EX_MESSAGE)).open();
                } else if (response.EX_RESULT = 'E') {
                    that._buildDialog(that.get_i18n("dialog_error"), "Error", that.get_i18n(response.EX_MESSAGE)).open();
                } else {
                    that._buildDialog(that.get_i18n("dialog_error"), "Error", that.get_i18n("dialog_msg_8") + ' ' + URL
                        + '.\n' + that.get_i18n("dialog_msg_8_1")).open();
                }
            },
            loadModelPuntoEmision: async function (oEvent) {
                let that = this;
                // Cargar oData Inicial
                var URL = "sgdd/maintainer/getEmissionPointByOffice";
                var obj  = that.getRowModelByKey(sap.ui.getCore().byId('oCombobox_sucursal'), 'modelSucursal', 'code')
                var oData = {
                    "office_ID": obj.ID
                };

                sap.ui.getCore().byId('oCombobox_puntoEmision').setEnabled(false)
                
                sap.ui.getCore().byId('oCombobox_puntoEmision').setSelectedKey('')

                let oModel = new JSONModel([]);
                that.getOwnerComponent().setModel(oModel, "modelPuntoEmision");
                //Dialogo Cargar + Accion POST
                sap.ui.getCore().byId('oCombobox_puntoEmision').setBusy(true)
                let response = await that.requestCAP(URL, oData, 'POST');
                sap.ui.getCore().byId('oCombobox_puntoEmision').setBusy(false)
                if (response.EX_RESULT == 'S') {
                    oModel = new JSONModel(response.EX_DATA);
                    that.getOwnerComponent().setModel(oModel, "modelPuntoEmision");
                    sap.ui.getCore().byId('oCombobox_puntoEmision').setEnabled(true)
                    
                }else if (response.EX_RESULT = 'E' && response.EX_MESSAGE=="sucursal_sin_punto_emision") {
                    that._buildDialog(that.get_i18n("dialog_informacion"), "Information", that.get_i18n(response.EX_MESSAGE)).open();
                } else if (response.EX_RESULT = 'E') {
                    that._buildDialog(that.get_i18n("dialog_error"), "Error", that.get_i18n(response.EX_MESSAGE)).open();
                } else {
                    that._buildDialog(that.get_i18n("dialog_error"), "Error", that.get_i18n("dialog_msg_8") + ' ' + URL
                        + '.\n' + that.get_i18n("dialog_msg_8_1")).open();
                }
            },
            loadModelPuntoEmision_: async function (id) {
                let that = this;
                // Cargar oData Inicial
                var URL = "sgdd/maintainer/getEmissionPointByOffice";
                //var obj  = that.getRowModelByKey(sap.ui.getCore().byId('oCombobox_sucursal'), 'modelSucursal', 'code')
                var oData = {
                    "office_ID": id
                };
                sap.ui.getCore().byId('oCombobox_puntoEmision').setEnabled(false)
                
                sap.ui.getCore().byId('oCombobox_puntoEmision').setSelectedKey('')
                let oModel = new JSONModel([]);
                that.getOwnerComponent().setModel(oModel, "modelPuntoEmision");
                //Dialogo Cargar + Accion POST
                sap.ui.getCore().byId('oCombobox_puntoEmision').setBusy(true)
                let response = await that.requestCAP(URL, oData, 'POST');
                sap.ui.getCore().byId('oCombobox_puntoEmision').setBusy(false)
                if (response.EX_RESULT == 'S') {
                    oModel = new JSONModel(response.EX_DATA);
                    that.getOwnerComponent().setModel(oModel, "modelPuntoEmision");
                    sap.ui.getCore().byId('oCombobox_puntoEmision').setEnabled(true)
                    
                }else if (response.EX_RESULT = 'E' && response.EX_MESSAGE=="sucursal_sin_punto_emision") {
                    that._buildDialog(that.get_i18n("dialog_informacion"), "Information", that.get_i18n(response.EX_MESSAGE)).open();
                } else if (response.EX_RESULT = 'E') {
                    that._buildDialog(that.get_i18n("dialog_error"), "Error", that.get_i18n(response.EX_MESSAGE)).open();
                } else {
                    that._buildDialog(that.get_i18n("dialog_error"), "Error", that.get_i18n("dialog_msg_8") + ' ' + URL
                        + '.\n' + that.get_i18n("dialog_msg_8_1")).open();
                }
            },

            //#######################################################################################################
            // AL CONFIRMAR DIALOGO REFERIRSE AQUI ###################################################################
            //########################################################################################################
            _confirmDialog: function (_title, _state, _text, _action) {
                var that = this;
                that.oDialog = new sap.m.Dialog({
                    title: _title,
                    type: 'Message',
                    state: _state,
                    content: new sap.m.Text({
                        text: _text
                    }),

                    buttons: [new sap.m.Button({
                        text: that.get_i18n("aceptar"),
                        press: function () {
                            switch (_action) {
                                case "crear":
                                    that._crear();
                                    break;
                                case "crear_":
                                    that._crear_();
                                    break;
                                case "editar_detalle":
                                    that._editarDetalle();
                                    break;
                                case "editar_detalle_":
                                    that._editarDetalle_();
                                    break;
                                case "eliminar":
                                    that._eliminar();
                                    break;
                                case "eliminar_":
                                    that._eliminar_();
                                    break;
                            }
                            that.oDialog.close();
                        }
                    }), new sap.m.Button({
                        text: that.get_i18n("cancelar"),
                        press: function () {
                            that.oDialog.close();
                        }
                    })],
                    afterClose: function () {
                        // that.reiniciarFormulario();
                        that.oDialog.destroy();
                    }
                });
                return that.oDialog;
            },

            //##############################################################################################################
            //##################### FUNCIONES FRAGMENTOS DETALLE ###########################################################
            //##############################################################################################################

            //Mostrar Fragmento Detalle
            _showFormFragment: function (sFragmentName) {
                var oPage = this.byId("idPageDetail");
                oPage.removeAllContent();
                this._getFormFragment(sFragmentName).then(function (oVBox) {
                    oPage.insertContent(oVBox);

                });
            },

            //Obtener Fragmento Detalle
            _getFormFragment: function (sFragmentName) {
                var pFormFragment = this._formFragments[sFragmentName],
                    oView = this.getView();
                if (!pFormFragment) {
                    pFormFragment = Fragment.load({
                        id: oView.getId(),
                        name: "sgddmusers.fragments." + sFragmentName,
                    });
                    this._formFragments[sFragmentName] = pFormFragment;
                }
                return pFormFragment;
            },
            _getFragment: function (name) {
                var that = this;
                if (that._oFragment) {
                    that._oFragment.destroy();
                }
                let _oFragment = new sap.ui.xmlfragment(name, that);
                that.getView().addDependent(_oFragment);
                jQuery.sap.syncStyleClass("sapUiSizeCompact", that.getView(), _oFragment);
                return _oFragment
            },
            _fragment: function (nameFragment) {
                var that = this;
                var oPage = this.byId("idPageDetail");
                oPage.removeAllContent();
                that._oFragment = that._getFragment("sgddmusers.fragments." + nameFragment);
                that.getView().byId("idPageDetail").addContent(that._oFragment)
                //that._oFragment.open();
            },
            //Cambiar y mostrar botones + Fragment
            _toggleButtonsAndView: function (bEdit) {
                var oView = this.getView();

                // Show the appropriate action buttons - Mostrar botones apropiados en pantalla
                oView.byId("edit").setVisible(!bEdit);
                oView.byId("save").setVisible(bEdit);
                oView.byId("cancel").setVisible(bEdit);

                // Set the right form type - Setear form apropiado entre editar o mostrar
                // this._showFormFragment(bEdit ? "EditarDetalle" : "MostrarDetalle");

                if (bEdit) {
                    //Primero Cargar Fragment
                    this._fragment("EditarDetalle");
                    //Despues Modelo o Cualquier accion

                } else {
                    //Primero Cargar Fragment
                    this._fragment("MostrarDetalle");
                    //Despues Modelo o Cualquier accion


                }
            },
            //SAVE-EDIT-CANCEL DETALLE (resetear form y botones)
            handleEditPress: function () {
                this._toggleButtonsAndView(true);
            },
            handleCancelPress: function () {
                this.loadDetail();
                this._toggleButtonsAndView(false);

            },
            handleSavePress: function () {
                this._confirmDialogEditDetalle()
            },
            //##############################################################################################################
            //##################### MISC FUNCTIONS #########################################################################
            //##############################################################################################################

            // Validar RUT
            validandoRut: function (event) {
                //Nueva Version RUT XX.XXX.XXX-X
                let that = this;
                let inputRut = event.getSource();
                let rutFormateado = this.formatRut(event.getSource().getValue());
                rutFormateado = this.onlynumbersandk(rutFormateado)
                inputRut.setValue(rutFormateado);
                let valido = this.rutEsValido(rutFormateado);

                if (valido == false || rutFormateado.toString().length < 10) {
                    inputRut.setValueState(ValueState.Error)
                    inputRut.setValueStateText(that.getView().getModel("i18n").getResourceBundle().getText("RUT_NO_VALIDO"))
                    that.flagRUT = true;
                } else {
                    that.flagRUT = false;
                    inputRut.setValueState(ValueState.Success)
                    inputRut.setValueStateText(that.getView().getModel("i18n").getResourceBundle().getText("RUT_VALIDO"))
                    rutFormateado = rutFormateado.toUpperCase();
                    inputRut.setValue(rutFormateado);
                }
            },
            //Agregar Formato // XX.XXX.XXX-X
            formatRut: (rut) => {
                const newRut = rut.replace(/\./g, '').replace(/\-/g, '').trim().toLowerCase();
                const lastDigit = newRut.substr(-1, 1);
                const rutDigit = newRut.substr(0, newRut.length - 1)
                let format = '';
                function numberWithCommas(x) {
                    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                }
                format = numberWithCommas(rutDigit)
                return format.concat('-').concat(lastDigit);
            },
            onlynumbersandk: function (rut2) {
                let characters = "1234567890."
                let characters_verificador = "1234567890kK"
                let rutsplit = rut2.split('-')
                let rut = rutsplit[0]
                let verificador = rutsplit[1]
                verificador = verificador.toUpperCase()
                let final = ''
                for (let i in rut) {
                    if (characters.includes(rut[i])) {
                        final += rut[i]
                    }
                }
                final += '-'
                if (characters_verificador.includes(verificador)) {
                    final += verificador
                }
                return final;
            },
            //Checkear RUT formateado
            rutEsValido: function (rut) {
                if (!rut || rut.trim().length < 3) return false;
                const rutLimpio = rut.replace(/[^0-9kK-]/g, "");

                if (rutLimpio.length < 3) return false;

                const split = rutLimpio.split("-");
                if (split.length !== 2) return false;

                const num = parseInt(split[0], 10);
                const dgv = split[1];

                const dvCalc = this.calculateDV(num);
                return dvCalc.toUpperCase() === dgv;
            },
            calculateDV: function (rut) {
                const cuerpo = `${rut}`;
                // Calcular Dígito Verificador
                let suma = 0;
                let multiplo = 2;

                // Para cada dígito del Cuerpo
                for (let i = 1; i <= cuerpo.length; i++) {
                    // Obtener su Producto con el Múltiplo Correspondiente
                    const index = multiplo * cuerpo.charAt(cuerpo.length - i);

                    // Sumar al Contador General
                    suma += index;

                    // Consolidar Múltiplo dentro del rango [2,7]
                    if (multiplo < 7) {
                        multiplo += 1;
                    } else {
                        multiplo = 2;
                    }
                }

                // Calcular Dígito Verificador en base al Módulo 11
                const dvEsperado = 11 - (suma % 11);
                if (dvEsperado === 10) return "k";
                if (dvEsperado === 11) return "0";
                return `${dvEsperado}`;
            },
            //RESET LOG + ELIMINAR
            resetButtons: function () {
                // LOG
                let that = this;
                that.byId('checkBox_log').setSelected(false);
                sap.ui.getCore().byId(that.createId("oTable_usMod")).setVisible(false);
                sap.ui.getCore().byId(that.createId("oTable_fechMod")).setVisible(false);
                sap.ui.getCore().byId(that.createId("oTable_usCre")).setVisible(false);
                sap.ui.getCore().byId(that.createId("oTable_fechCre")).setVisible(false);

                // Eliminar
                that.byId('deleteButton').setText(that.getView().getModel("i18n").getResourceBundle().getText("iconTab_Eliminar"));
                that.byId('col_deleteButton').setVisible(false);
            },
            resetButtons_: function () {
                // LOG 
                sap.ui.getCore().byId('checkBox_log_').setSelected(false);
                sap.ui.getCore().byId("oTable_usMod_").setVisible(false);
                sap.ui.getCore().byId("oTable_fechMod_").setVisible(false);
                sap.ui.getCore().byId("oTable_usCre_").setVisible(false);
                sap.ui.getCore().byId("oTable_fechCre_").setVisible(false);
            },
            //Transformar a Mayusculas
            upperCaseValue: function (oEvent) {
                let obj = oEvent.getSource()
                let value = obj.getValue()
                obj.setValue(value.toUpperCase())
            },
            // Tab Bar Destinatarios
            _onTabBarSelect: function (oEvent) {
                var that = this;
                switch (oEvent.getParameter("key")) {
                    case "actualizarDestinatarios":
                        that.loadModel();
                        break;
                    case "crear":
                        that._pop_crearRegistro(oEvent);
                        break;

                }
            },
            //Tab Bar 
            _onTabBarSelect_Fragment: function (oEvent) {
                var that = this;
                switch (oEvent.getParameter("key")) {
                    case "actualizar_":
                        that.loadPuntoEmision(that.actualoID);
                        break;
                    case "crear_":
                        that._pop_crear_(oEvent);
                        break;
                }
            },


            // Validar Email
            validateEmail: function (email) {
                const re = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
                return re.test(String(email).toLowerCase());
            },
            emailValidador: function (event) {
                let that = this;
                let oInput_email = event.getSource();
                let email = event.getSource().getValue();
                let valido = that.validateEmail(email);
                oInput_email.setValue(email.toUpperCase());
                if (valido == false) {
                    oInput_email.setValueState(ValueState.Error)
                    oInput_email.setValueStateText('EMAIL ' + that.get_i18n("no_valido"))
                    that.flagEmail = true
                } else {
                    oInput_email.setValueState(ValueState.Success)
                    oInput_email.setValueStateText('EMAIL ' + that.get_i18n("valido"))
                    that.flagEmail = false
                }
            },

            // Validar Telefono
            validatePhone: function (phone) {
                const x = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g
                return x.test(String(phone));
            },

            validadorTelefono: function (event) {
                let that = this;
                let oInput_phone = event.getSource();
                let telefono = event.getSource().getValue();
                let isValid = that.validatePhone(telefono);
                if (isValid == false) {
                    oInput_phone.setValueState(ValueState.Error)
                    oInput_phone.setValueStateText(that.get_i18n('TELEFONO') + that.get_i18n("no_valido"))
                    that.flagTelefono = true
                } else {
                    oInput_phone.setValueState(ValueState.Success)
                    oInput_phone.setValueStateText(that.get_i18n('TELEFONO') + that.get_i18n("valido"))
                    that.flagTelefono = false
                }
            },
            validarFecha_: function (date) {
                let that = this;
                let dia = date.substring(8, 10);
                let mes = date.substring(5, 7);
                let anio = date.substring(0, 4);
                let sep1 = date.substring(4, 5);
                let sep2 = date.substring(7, 8);
                if (!(typeof parseInt(dia) === "number") || !(typeof parseInt(mes) == "number") || !(typeof parseInt(anio) == "number") || date.length >
                    10 || date.length == 0 || sep1 != "-" || sep2 != "-") {
                    return false;
                } else {
                    return true;
                }
            },
            validarFecha: function (oEvent) {
                let that = this;
                let datepicker=oEvent.getSource()
                let date= datepicker.getValue()
                let dia = date.substring(8, 10);
                let mes = date.substring(5, 7);
                let anio = date.substring(0, 4);
                let sep1 = date.substring(4, 5);
                let sep2 = date.substring(7, 8);
                if (!(typeof parseInt(dia) === "number") || !(typeof parseInt(mes) == "number") || !(typeof parseInt(anio) == "number") || date.length >
                    10 || date.length == 0 || sep1 != "-" || sep2 != "-") {
                    datepicker.setValueState(ValueState.Error)
                    datepicker.setValueStateText(that.get_i18n("no_valido"))
                } else {
                    datepicker.setValueState(ValueState.Success)
                    datepicker.setValueStateText(that.get_i18n("valido"))
                }
            },
		});
	});
