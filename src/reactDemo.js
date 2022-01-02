'use strict';
let users;

fetch('/Home/AppUsers').then(response => {
    response.json().then(data => {
        users = data;
        ReactDOM.render(<UserSummary users={users} />, document.getElementById('userRecords'));
        document.getElementById('UsersListContainer').style.display = "";
    })
});

function UserSummary(params) {
    users = params.users;
    users.forEach(u => u.EnabledSymbol = u.Enabled ? "✔️" : "❌");
    return (
        users.map((u, index) => (
            <tr key={u.UserName}>
                <td>{u.UserName}</td>
                <td>{u.DisplayName}</td>
                <td>{u.EnabledSymbol}</td>
                <td>
                    <button onClick={() => EditUser(u.UserName)}>Edit</button>
                </td>
            </tr >
        ))
    );
}

function EditUser(userName) {
    const userDetails = users.find(uu => uu.UserName === userName);
    ReactDOM.render(<User user={userDetails} />, document.getElementById('EditRecord'));
    $('#UsersListContainer').hide();
    $('#EditRecord').show();
}

function User(props) {
    const editedUser = props.user;
    const [values, setValues] = React.useState(editedUser);

    const handleInputChange = (e) => {
        setValues(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }

    const handleCheckBoxChange = (e) => {
        setValues(prev => ({ ...prev, [e.target.name]: e.target.checked }));
    }

    const handleSubmit = (event) => {
        if (event) {
            event.preventDefault();
            //POST details to the server and reload the page to view updated users list
            $.ajax({
                url: '/Home/UpdateUser',
                data: { editedUser: values },
                type: 'POST',
                success: function () {
                    const originalUser = users.find(uu => uu.UserName === editedUser.UserName);
                    originalUser.DisplayName = values.DisplayName;
                    originalUser.Enabled = values.Enabled;
                    ReactDOM.render(<UserSummary users={users} />, document.getElementById('userRecords'));
                    $('#UsersListContainer').show();
                    $('#EditRecord').hide();
                },
                successFalse: function (data) {
                    alert("Error updating user");
                }
            });
        }
    };

    return (
        <form id="UserForm" onSubmit={handleSubmit} >
            <div className="maintSection">
                <label>User Name</label><label>{values.UserName}</label>
                <label>Enabled</label><input type="checkbox" name="Enabled" checked={values.Enabled} onChange={handleCheckBoxChange} />
                <label>Display Name</label><input type="text" name="DisplayName" className="form-control" value={values.DisplayName} onChange={handleInputChange} required />
            </div>
            <button type="submit" className="btn btn-success">Save</button>
        </form>
    );
}
