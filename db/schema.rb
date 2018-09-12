# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2018_09_10_162024) do

  create_table "customers", force: :cascade do |t|
    t.string "email"
    t.string "firstname"
    t.string "lastname"
    t.boolean "irb"
    t.text "studyname"
    t.text "studydescription"
    t.text "institution"
    t.string "telephone"
    t.text "address"
    t.boolean "contactemailok"
    t.boolean "contacttelephoneok"
    t.boolean "contactpapermail"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.text "sampletype"
    t.text "studygroup"
    t.text "comments"
    t.string "studygroupunaffected"
  end

  create_table "families", force: :cascade do |t|
    t.integer "subject_id"
    t.integer "related_unaffected_id"
    t.integer "pedigree"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["related_unaffected_id"], name: "index_families_on_related_unaffected_id"
    t.index ["subject_id"], name: "index_families_on_subject_id"
  end

  create_table "related_unaffecteds", force: :cascade do |t|
    t.string "sex"
    t.string "race"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.decimal "dna", precision: 8, scale: 2
    t.decimal "serum", precision: 8, scale: 2
    t.decimal "plasma", precision: 8, scale: 2
    t.decimal "pax", precision: 8, scale: 2
    t.decimal "blood", precision: 8, scale: 2
    t.decimal "hla", precision: 8, scale: 2
    t.integer "pedigree"
  end

  create_table "subjects", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "sex"
    t.string "disease_course"
    t.integer "age_onset"
    t.string "recent_edss"
    t.string "phenotype_datasource"
    t.string "race"
    t.string "hispanic"
    t.decimal "dna", precision: 8, scale: 2
    t.decimal "serum", precision: 8, scale: 2
    t.decimal "plasma", precision: 8, scale: 2
    t.decimal "pax", precision: 8, scale: 2
    t.decimal "blood", precision: 8, scale: 2
    t.decimal "hla", precision: 8, scale: 2
    t.string "disease"
    t.integer "pedigree"
    t.string "affected_status"
  end

  create_table "unrelated_unaffecteds", force: :cascade do |t|
    t.string "sex"
    t.string "race"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.decimal "dna", precision: 8, scale: 2
    t.decimal "serum", precision: 8, scale: 2
    t.decimal "plasma", precision: 8, scale: 2
    t.decimal "pax", precision: 8, scale: 2
    t.decimal "blood", precision: 8, scale: 2
    t.decimal "hla", precision: 8, scale: 2
  end

end
