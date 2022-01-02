'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var users = void 0;

fetch('/Home/AppUsers').then(function (response) {
    response.json().then(function (data) {
        users = data;
        ReactDOM.render(React.createElement(UserSummary, { users: users }), document.getElementById('userRecords'));
        document.getElementById('UsersListContainer').style.display = "";
    });
});

function UserSummary(params) {
    users = params.users;
    users.forEach(function (u) {
        return u.EnabledSymbol = u.Enabled ? "✔️" : "❌";
    });
    return users.map(function (u, index) {
        return React.createElement(
            'tr',
            { key: u.UserName },
            React.createElement(
                'td',
                null,
                u.UserName
            ),
            React.createElement(
                'td',
                null,
                u.DisplayName
            ),
            React.createElement(
                'td',
                null,
                u.EnabledSymbol
            ),
            React.createElement(
                'td',
                null,
                React.createElement(
                    'button',
                    { onClick: function onClick() {
                            return EditUser(u.UserName);
                        } },
                    'Edit'
                )
            )
        );
    });
}

function EditUser(userName) {
    var userDetails = users.find(function (uu) {
        return uu.UserName === userName;
    });
    ReactDOM.render(React.createElement(User, { user: userDetails }), document.getElementById('EditRecord'));
    $('#UsersListContainer').hide();
    $('#EditRecord').show();
}

function User(props) {
    var editedUser = props.user;

    var _React$useState = React.useState(editedUser),
        _React$useState2 = _slicedToArray(_React$useState, 2),
        values = _React$useState2[0],
        setValues = _React$useState2[1];

    var handleInputChange = function handleInputChange(e) {
        setValues(function (prev) {
            return Object.assign({}, prev, _defineProperty({}, e.target.name, e.target.value));
        });
    };

    var handleCheckBoxChange = function handleCheckBoxChange(e) {
        setValues(function (prev) {
            return Object.assign({}, prev, _defineProperty({}, e.target.name, e.target.checked));
        });
    };

    var handleSubmit = function handleSubmit(event) {
        if (event) {
            event.preventDefault();
            //POST details to the server and reload the page to view updated users list
            $.ajax({
                url: '/Home/UpdateUser',
                data: { editedUser: values },
                type: 'POST',
                success: function success() {
                    var originalUser = users.find(function (uu) {
                        return uu.UserName === editedUser.UserName;
                    });
                    originalUser.DisplayName = values.DisplayName;
                    originalUser.Enabled = values.Enabled;
                    ReactDOM.render(React.createElement(UserSummary, { users: users }), document.getElementById('userRecords'));
                    $('#UsersListContainer').show();
                    $('#EditRecord').hide();
                },
                successFalse: function successFalse(data) {
                    alert("Error updating user");
                }
            });
        }
    };

    return React.createElement(
        'form',
        { id: 'UserForm', onSubmit: handleSubmit },
        React.createElement(
            'div',
            { className: 'maintSection' },
            React.createElement(
                'label',
                null,
                'User Name'
            ),
            React.createElement(
                'label',
                null,
                values.UserName
            ),
            React.createElement(
                'label',
                null,
                'Enabled'
            ),
            React.createElement('input', { type: 'checkbox', name: 'Enabled', checked: values.Enabled, onChange: handleCheckBoxChange }),
            React.createElement(
                'label',
                null,
                'Display Name'
            ),
            React.createElement('input', { type: 'text', name: 'DisplayName', className: 'form-control', value: values.DisplayName, onChange: handleInputChange, required: true })
        ),
        React.createElement(
            'button',
            { type: 'submit', className: 'btn btn-success' },
            'Save'
        )
    );
}