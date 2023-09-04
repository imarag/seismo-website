from wtforms import Form, BooleanField, StringField, PasswordField, validators, SubmitField, ValidationError

class RegistrationForm(Form):
    fullname = StringField(
        label = 'Fullname', 
        validators = [
            validators.InputRequired(message="Fullname is required!"), 
            validators.Length(min=4, max=45, message="Fullname must be between 4 and 45 characters in length!")
            ]
        )
    email = StringField(
        label = 'Email', 
        validators = [
            validators.InputRequired(message="Email is required!"), 
            validators.Email(message="Please enter a valid email address!"),
            validators.Length(min=6, max=120, message="Email must be between 6 and 120 characters long!"), 
            ]
        )
    password = PasswordField(
        label = 'Password', 
        validators = [
            validators.InputRequired(message="Password is required!"),
            validators.Length(min=6, max=20, message="Password must be between 6 and 20 characters long!"),            
            ]
        )
    


class LoginForm(Form):
    email = StringField(
        label = 'Email', 
        validators = [
            validators.InputRequired(message="Email is required!"), 
            validators.Email(message="Please enter a valid email address!")
            ]
        )
    password = PasswordField(
        label = 'Password', 
        validators = [
            validators.InputRequired(message="Password is required!"),
            validators.Length(min=6, max=20, message="Password must be between 6 and 20 characters long!"),            
            ]
        )

class EditAccountForm(Form):
    fullname = StringField(
        label = 'Fullname', 
        validators = [
            validators.InputRequired(message="Fullname is required!"), 
            validators.Length(min=4, max=45, message="Fullname must be between 4 and 45 characters in length!")
            ]
        )
    email = StringField(
        label = 'Email', 
        validators = [
            validators.InputRequired(message="Email is required!"), 
            validators.Email(message="Please enter a valid email address!"),
            validators.Length(min=6, max=120, message="Email must be between 6 and 120 characters long!"), 
            ]
        )
    


class ChangePasswordForm(Form):
    password = PasswordField(
        label = 'Password', 
        validators = [
            validators.InputRequired(message="Password is required!"),
            validators.Length(min=6, max=20, message="Password must be between 6 and 20 characters long!"),            
            ]
        )
    new_password = PasswordField(
        label = 'New password', 
        validators = [
            validators.InputRequired(message="New password is required!"),
            validators.Length(min=6, max=20, message="Password must be between 6 and 20 characters long!"),            
            ]
        )
    confirm_new_password = PasswordField(
        label = 'Confirm new password', 
        validators = [
            validators.InputRequired(message="New password confirmation is required!"),
            validators.Length(min=6, max=20, message="Password must be between 6 and 20 characters long!"),   
            validators.EqualTo('new_password', message="The confirmation password must be equal to the new password!")         
            ]
        )
    
    def validate_new_password(form, field):
        if field.data == form.password.data:
            raise ValidationError('Old password cannot be equal to new password!')
        

class ForgotPasswordForm(Form):
    email = StringField(
        label = 'Email', 
        validators = [
            validators.Email(message="Please enter a valid email address!"),
            validators.InputRequired(message="Email is required!"), 
            validators.Length(min=6, max=120, message="Email must be between 6 and 120 characters long!"), 
            ]
        )
    

class ResetPasswordForm(Form):
    new_password = PasswordField(
        label = 'New password', 
        validators = [
            validators.InputRequired(message="New password is required!"),
            validators.Length(min=6, max=20, message="Password must be between 6 and 20 characters long!"),            
            ]
        )
    confirm_new_password = PasswordField(
        label = 'Confirm new password', 
        validators = [
            validators.InputRequired(message="New password confirmation is required!"),
            validators.Length(min=6, max=20, message="Password must be between 6 and 20 characters long!"),   
            validators.EqualTo('new_password', message="The confirmation password must be equal to the new password!")         
            ]
        )
    