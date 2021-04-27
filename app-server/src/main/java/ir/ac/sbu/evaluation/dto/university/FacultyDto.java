package ir.ac.sbu.evaluation.dto.university;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;
import ir.ac.sbu.evaluation.model.university.Faculty;
import javax.validation.constraints.NotBlank;
import lombok.Builder;

public class FacultyDto {

    @JsonProperty(access = Access.READ_ONLY)
    private long id;

    @NotBlank
    private String name;

    @NotBlank
    private String location;

    public FacultyDto() {
    }

    @Builder
    public FacultyDto(long id, String name, String location) {
        this.id = id;
        this.name = name;
        this.location = location;
    }

    public static FacultyDto from(Faculty faculty) {
        return FacultyDto.builder()
                .id(faculty.getId())
                .name(faculty.getName())
                .location(faculty.getLocation())
                .build();
    }

    public Faculty toFaculty() {
        return Faculty.builder()
                .id(id)
                .name(name)
                .location(location)
                .build();
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }
}
