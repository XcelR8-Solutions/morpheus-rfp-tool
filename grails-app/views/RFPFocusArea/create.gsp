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
                    <g:form role="form" name="createAccountForm" action="create" controller="accounts" namespace="admin" method="POST" class="form-horizontal create-account-form">
                        <div class="row">
                            <div class="form-group">
                                <label for="RFPFocusArea.name" class="col-sm-2 input-label">Focus Area Name</label>
                                <div class="col-md-9">
                                    <g:textField name="RFPFocusArea.name"
                                        placeholder="Name"
                                        required="true"
                                        value="${user?.account?.companyName}"
                    					readonly="readonly"/>
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