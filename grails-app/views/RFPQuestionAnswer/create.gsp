<!DOCTYPE html>
<html>
<head>
    <title>Question and Answer | Morpheus RFP Tool</title>
    <meta name="layout" content="main"/>
</head>
<body data-page="main-index">
<div class="accounts">
    <div class="accounts-container">
        <div class="row">
            <div class="col-sm-9">
                <div class="section-container">
                    <p class="section-title">QUESTION AND ANSWER - ADD</p>
                    <g:form role="form" name="createQAForm" action="create" namespace="admin" method="POST" class="form-horizontal create-account-form">
                        <div class="row">
                            <div class="form-group">
                                <label for="question" class="col-sm-2 input-label">RFP Question</label>
                                <div class="col-md-9">
                                    <g:textArea name="question"
                                        placeholder="Enter Question"
                                        required="true"
                                        value=""/>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="form-group">
                                <label for="answer" class="col-sm-2 input-label">RFP Answer</label>
                                <div class="col-md-9">
                                    <g:textArea name="answer"
                                        placeholder="Enter Answer"
                                        required="true"
                                        value=""/>
                                </div>
                            </div>
                        </div>
                        <div class="row btn-container-row">
                            <div class="form-group">
                                <div class="col-sm-4 col-sm-offset-2">
                                    <g:link action="cancel" namespace="admin" class="button grey margin-right">Cancel</g:link>
                                    <g:actionSubmit value="Save" action="save" class="button"/>
                                </div>
                            </div>
                        </div>
                    </g:form>
                </div>
            </div>
        </div>
    </div>
</div>
</body>
</html>