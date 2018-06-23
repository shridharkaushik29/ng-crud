export var dialog = [
    '$mdDialog',
    '$options',
    '$rootScope',
    '$q',
    ($mdDialog, $options, $rootScope, $q) => {

        var options = {};

        options.clickOutsideToClose = true;

        _.merge(options, $options);

        if (!options.scope) {
            options.scope = $rootScope.$new();
        }

        var defer = $q.defer();

        options.scope = _.merge(options.scope, options.scopes);

        options.scope.hide = $mdDialog.hide;
        options.scope.cancel = $mdDialog.cancel;
        options.scope.notify = defer.notify;

        var dialog = $mdDialog.show(options);

        dialog.cancel = $mdDialog.cancel;
        dialog.hide = $mdDialog.hide;
        dialog.notify = $mdDialog.notify;

        dialog.then(defer.resolve, defer.reject);

        return defer.promise;
    }
]

export var notify = [
    '$mdToast',
    '$options',
    ($mdToast, $options) => {
        var type = $options.type;
        var message;

        if (type !== undefined) {
            if (type === 'success') {
                message = "Success: ";
            } else if (type === 'error') {
                message = "Error: ";
            }
            message += $options.message;
        } else {
            message = $options.message;
        }


        var dialogOptions = _.merge({
            textContent: message,
            position: "bottom right",
            action: "Hide"
        }, $options);

        var preset = $mdToast.simple(dialogOptions).textContent($options.textContent || message);

        return $mdToast.show(preset);
    }
]

export var alert = [
    '$mdDialog',
    '$options',
    ($mdDialog, $options) => {
        var config = {};
        config.ok = "Okay!";
        config.multiple = true;

        _.merge(config, $options);

        if (config.data) {
            if (config.data.type === 'success') {
                config.textContent = "Success: ";
            } else {
                config.textContent = "Success: ";
            }
            config.textContent += config.data.message;
        }

        var a = $mdDialog
                .alert(config)
                .textContent(config.textContent || config.message)

        return $mdDialog.show(a);
    }
]

export var confirm = [
    '$mdDialog',
    '$options',
    '$q',
    ($mdDialog, $options, $q) => {

        var config = {};

        config.title = "Are you sure?";
        config.textContent = "This action won't be reversed";
        config.ok = "Yes! Sure";
        config.cancel = "No I'm Not";
        config.multiple = true;

        _.merge(config, $options);

        var a = $mdDialog
                .confirm(config);
        return $mdDialog.show(a);
    }
]

export var prompt = [
    '$mdDialog',
    '$options',
    ($mdDialog, $options) => {

        var config = {};

        config.ok = "Submit";
        config.cancel = "Cancel";
        config.multiple = true;
        config.placeholder = "Type here..."

        _.merge(config, $options);

        var a = $mdDialog.prompt(config)

        return $mdDialog.show(a);
    }

]