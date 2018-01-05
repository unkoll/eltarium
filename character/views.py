from django.shortcuts import render

# Create your views here.


def create(request):
    return render(
        request,
        'create/character.html'
    )


def character(request, name):
    return render(
        request,
        'character.html',
        {
            'name': name
        }
    )

