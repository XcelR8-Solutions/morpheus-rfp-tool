package com.morpheus.rfptool

class RFPQuestionAnswer {

    String question
    String answer
    Date dateCreated
    Date lastUpdated

    static constraints = {
    	question(nullable:false)
    	answer(nullable:false)
    }

    public String toString() {
        "ID:${id}, Question:${question}, Answer:${answer}"
    }
}
