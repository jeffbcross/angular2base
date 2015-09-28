var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var angular2_1 = require('angular2/angular2');
(function (ALLOWED_FIREBASE_EVENTS) {
    ALLOWED_FIREBASE_EVENTS[ALLOWED_FIREBASE_EVENTS["value"] = 0] = "value";
    ALLOWED_FIREBASE_EVENTS[ALLOWED_FIREBASE_EVENTS["child_added"] = 1] = "child_added";
})(exports.ALLOWED_FIREBASE_EVENTS || (exports.ALLOWED_FIREBASE_EVENTS = {}));
var ALLOWED_FIREBASE_EVENTS = exports.ALLOWED_FIREBASE_EVENTS;
;
//TODO: create new reference if input string changes
//TODO: support once instead of on
//TODO: handle different events differently (like child_added)
//TODO: Should event be allowed to change?
var FirebaseOnValuePipe = (function () {
    function FirebaseOnValuePipe(cdRef) {
        this._cdRef = cdRef;
    }
    FirebaseOnValuePipe.prototype.transform = function (value, args) {
        var _this = this;
        if (!this._fbRef) {
            this._fbRef = new Firebase(value);
            var event_1 = this._getEventFromArgs(args);
            if (ALLOWED_FIREBASE_EVENTS[event_1] === ALLOWED_FIREBASE_EVENTS.child_added) {
                this._fbRef.on(event_1, function (snapshot) {
                    // Wait to create array until value exists
                    if (!_this._latestValue)
                        _this._latestValue = [];
                    _this._latestValue.push(snapshot.val());
                    _this._cdRef.requestCheck();
                });
            }
            else {
                this._fbRef.on(event_1, function (snapshot) {
                    _this._latestValue = snapshot.val();
                    _this._cdRef.requestCheck();
                });
            }
            return null;
        }
        if (this._latestValue === this._latestReturnedValue) {
            return this._latestValue;
        }
        else {
            this._latestReturnedValue = this._latestValue;
            return angular2_1.WrappedValue.wrap(this._latestReturnedValue);
        }
        return null;
    };
    FirebaseOnValuePipe.prototype.onDestroy = function () {
        if (this._fbRef) {
            this._fbRef.off();
        }
    };
    FirebaseOnValuePipe.prototype._getEventFromArgs = function (args) {
        //TODO(jeffbcross): fix this when args parsing doesn't add stupid quotes
        if (args[0] && args[0][0] === '"') {
            args[0] = args[0].replace(/"/g, '');
        }
        if (args && typeof ALLOWED_FIREBASE_EVENTS[args[0]] === 'number') {
            return args[0];
        }
        throw "Not a valid event to listen to: " + args[0] + ".\n      Please provide a valid event, such as \"child_added\", by adding it as an\n      argument to the pipe: \"value | firebase:child_added\".\n      See https://www.firebase.com/docs/web/api/query/on.html for supported events.";
    };
    FirebaseOnValuePipe = __decorate([
        angular2_1.Pipe({
            name: 'firebasevalue'
        }),
        __param(0, angular2_1.Inject(angular2_1.ChangeDetectorRef)), 
        __metadata('design:paramtypes', [Object])
    ], FirebaseOnValuePipe);
    return FirebaseOnValuePipe;
})();
exports.FirebaseOnValuePipe = FirebaseOnValuePipe;
//# sourceMappingURL=firebasepipe.js.map