from flask import Flask,request,jsonify, render_template
from flask_sqlalchemy import SQLAlchemy


app = Flask(__name__)

# SQLite Database
app.config['SQLALCHEMY_DATABASE_URI']='sqlite:///techvault.db'
app.config['SQLALCHEMY_TRACK_MOTIFICATIONS']=False

db=SQLAlchemy(app)

class Technology(db.Model):
    id=db.Column(db.Integer, primary_key=True)
    name=db.Column(db.String(100), nullable=False)
    category=db.Column(db.String(100))
    defination=db.Column(db.Text, nullable=False)
    uses=db.Column(db.Text)
    examples=db.Column(db.Text)
    notes=db.Column(db.Text)

    def to_dict(self):
        return {"id":self.id,
        "name":self.name,
        "category":self.category,
        "defination":self.defination,
        "uses":self.uses,
        "examples":self.examples,
        "notes":self.notes
        }
# Create Database
with app.app_context():
    db.create_all()


@app.route("/")
def home():
    return render_template("index.html")

@app.route("/add-tech")
def add_tech():
    return render_template("add_tech.html")

@app.route("/update-tech/<int:id>")
def update_tech(id):
    return render_template("update_tech.html",id=id)

# ===============================
#  Get All Technologies
# ===============================

@app.route("/technologies",methods=["GET"])
def get_technologies():

    search=request.args.get('search')

    #Pagination
    page = request.args.get(
        "page",
        default=1,
        type = int
    )

    per_page = request.args.get(
        "per_page",
        default=10,
        type = int
    )

    #start query
    query = Technology.query

    # Search by name
    if search:
        query = query.filter(
            Technology.name.ilike(f"%{search}%")
        )

    # Pagination
    pagination = query.paginate(
        page=page,
        per_page=per_page,
        error_out=False
    )

    # Convert to Json
    technologies = [
        tech.to_dict() for tech in pagination.items
    ]

    return jsonify(
        {
            "data":technologies,
            "pagination":
                {
                    "page":pagination.page,
                    "per_page":pagination.per_page,
                    "total_items":pagination.total,
                    "total_pages":pagination.pages,
                    "has_next": pagination.has_next,
                    "has_previous":pagination.has_prev
                }
        }
    )



# ===============================
# Get One Technology
# ===============================
@app.route("/technologies/<int:id>",methods=["GET"])
def get_technology(id):
    tech = Technology.query.get_or_404(id)
    return jsonify(tech.to_dict())



# ===============================
# Add Technology
# ===============================
@app.route('/technologies',methods=["POST"])
def add_technology():
    data=request.get_json()
    print(data)
    print(data["name"])

    if not data:
        return jsonify(
            {
                "message":"No Data Found"
            }
        ),400
    
    tech=Technology(
        name=data["name"],
        category=data["category"],
        defination=data["defination"],
        uses=data["uses"],
        examples=data["examples"],
        notes=data["notes"]
    )

    db.session.add(tech)
    db.session.commit()

    return jsonify({
        "message":"Technology Added Successfully"
    }),201



# ===============================
# Update Technology
# ===============================
@app.route("/technologies/<int:id>",methods=["PUT"])
def update_technology(id):
    tech = Technology.query.get_or_404(id)

    data = request.get_json()

    tech.name = data.get("name",tech.name)
    tech.category = data.get("category",tech.category)
    tech.defination = data.get("defination",tech.defination)
    tech.examples = data.get("examples",tech.examples)
    tech.uses = data.get("uses",tech.uses)
    tech.notes = data.get("notes",tech.notes)

    db.session.commit()

    return jsonify(
        {
            "message":"Technology Updated Successfully"
        }
    ),201

# ===============================
# Delete Technology
# ===============================
@app.route("/technologies/<int:id>", methods=["DELETE"])
def delete_technology(id):
    tech = Technology.query.get_or_404(id)
    db.session.delete(tech)
    db.session.commit()

    return jsonify(
        {
            "message":"Technology Delete Successfully"
        }
    ),200



if __name__ == '__main__':
    app.run(debug=True)