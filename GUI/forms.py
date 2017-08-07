from django import forms

class MainMenu(forms.Form):
    name = forms.CharField(label='Name', max_length=50)
    starting_point = forms.ChoiceField(choices=(
        (1, ("Under the Bridge")),
    ))