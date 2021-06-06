package ir.ac.sbu.evaluation.dto.university.faculty;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import ir.ac.sbu.evaluation.model.university.Faculty;
import java.util.Objects;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonInclude(Include.NON_NULL)
public class FacultyDto {

    private long id;
    private String name;
    private String webAddress;

    private Long studentsCount;
    private Long mastersCount;

    public FacultyDto() {
    }

    @Builder
    public FacultyDto(long id, String name, String webAddress, Long studentsCount, Long mastersCount) {
        this.id = id;
        this.name = name;
        this.webAddress = webAddress;
        this.studentsCount = studentsCount;
        this.mastersCount = mastersCount;
    }

    public static FacultyDto from(Faculty faculty, boolean hasExpansionInfo) {
        return FacultyDto.builder()
                .id(faculty.getId())
                .name(faculty.getName())
                .webAddress(faculty.getWebAddress())
                .studentsCount(hasExpansionInfo ? (long) faculty.getStudents().size() : null)
                .mastersCount(hasExpansionInfo ? (long) faculty.getMasters().size() : null)
                .build();
    }

    public static FacultyDto from(Faculty faculty) {
        return from(faculty, true);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        FacultyDto that = (FacultyDto) o;
        return id == that.id
                && Objects.equals(name, that.name)
                && Objects.equals(webAddress, that.webAddress);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, webAddress);
    }
}
