package ir.ac.sbu.evaluation.dto.university;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;
import ir.ac.sbu.evaluation.model.university.Faculty;
import javax.validation.constraints.NotBlank;
import lombok.Builder;

@JsonInclude(Include.NON_NULL)
public class FacultyDto {

    @JsonProperty(access = Access.READ_ONLY)
    private long id;

    @NotBlank
    private String name;

    private String location;

    @JsonProperty(access = Access.READ_ONLY)
    private Long studentsCount;

    @JsonProperty(access = Access.READ_ONLY)
    private Long mastersCount;

    public FacultyDto() {
    }

    @Builder
    public FacultyDto(long id, String name, String location, Long studentsCount, Long mastersCount) {
        this.id = id;
        this.name = name;
        this.location = location;
        this.studentsCount = studentsCount;
        this.mastersCount = mastersCount;
    }

    public static FacultyDto from(Faculty faculty, boolean hasExpansionInfo) {
        return FacultyDto.builder()
                .id(faculty.getId())
                .name(faculty.getName())
                .location(faculty.getLocation())
                .studentsCount(hasExpansionInfo ? (long) faculty.getStudents().size() : null)
                .mastersCount(hasExpansionInfo ? (long) faculty.getMasters().size() : null)
                .build();
    }

    public static FacultyDto from(Faculty faculty) {
        return from(faculty, true);
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

    public Long getStudentsCount() {
        return studentsCount;
    }

    public void setStudentsCount(Long studentsCount) {
        this.studentsCount = studentsCount;
    }

    public Long getMastersCount() {
        return mastersCount;
    }

    public void setMastersCount(Long mastersCount) {
        this.mastersCount = mastersCount;
    }
}
