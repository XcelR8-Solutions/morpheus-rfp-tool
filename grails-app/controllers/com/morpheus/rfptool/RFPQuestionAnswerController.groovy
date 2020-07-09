package com.morpheus.rfptool

class RFPQuestionAnswerController {

    def index() { 
		def rtn = [:]
		def qryResults = RFPQuestionAnswer.list();
		rtn.qaList = [questionAnswers: qryResults]
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
    	flash.message = "RFP Question/Answer created successfully!"

    	def rfpQA = new RFPQuestionAnswer(params)
        rfpQA.save()

    	redirect action: 'index'
    }
}
