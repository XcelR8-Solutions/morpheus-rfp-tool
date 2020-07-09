<!DOCTYPE html>
<html>
<head>
    <title>Focus Area | Morpheus RFP Tool</title>
    <meta name="layout" content="main"/>
</head>
<body data-page="main-index">
<div class="accounts">
    <div class="accounts-container">
        <div class="row">
            <div class="col-sm-9">
                <div class="section-container">
                    <p class="section-title">FOCUS AREA - ADD</p>
                    <g:form role="form" name="FAForm" action="create" namespace="admin" method="POST" class="form-horizontal create-account-form">
                        <div class="row">
                            <div class="form-group">
                                <label for="name" class="col-sm-2 input-label">Focus Area Name</label>
                                <div class="col-md-9">
                                    <g:textField name="name"
                                        placeholder="Enter Name"
                                        required="true"
                                        value=""/>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="form-group">
                                <label for="description" class="col-sm-2 input-label">Focus Area Description</label>
                                <div class="col-md-9">
                                    <g:textField name="description"
                                        placeholder="Enter Description"
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