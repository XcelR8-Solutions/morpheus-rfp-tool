package com.morpheus.rfptool

class RFPFocusAreaController {

    def index() { 
		def rtn = [:]
		def qryResults = RFPFocusArea.list();
		rtn.focusAreaList = [areas: qryResults]
    	return rtn;
    }

    def create() { 

    }
}
