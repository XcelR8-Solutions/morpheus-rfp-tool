package com.morpheus.rfptool

class RFPFocusArea {
	
	String name
    String description
    Date dateCreated
    Date lastUpdated

    static constraints = {
    	name(nullable:false)
    	description(nullable:true)
    }

    public String toString() {
        "ID:${id}, Name:${name}, Description:${description}"
    }
}
