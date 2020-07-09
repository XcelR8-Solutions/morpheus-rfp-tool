package com.morpheus.rfptool

class RFPFocusAreaController {

    def index() { 
		def rtn = [:]
		def qryResults = RFPFocusArea.list();
		rtn.focusAreaList = [areas: qryResults]
    	return rtn;
    }

    def create() { 
    	 render view: 'create'
    }

    def cancel() {
    	redirect action: 'index'
    }

    def save() {
    	log.debug "save params: ${params}"
    	flash.message = "RFP Focus Area created successfully!"

    	def rfpFA = new RFPFocusArea(params)
        rfpFA.save()

    	redirect action: 'index'
    }
}
